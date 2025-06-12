const feedContainer = document.getElementById("feedContainer");
const mainScroll = document.getElementById("mainScroll");
const loadingIndicator = document.createElement("div"); 
loadingIndicator.innerHTML = `<div class="card heightSmall skeleton-card">
    <div class="card_image skeleton-box"></div>
    <div class="card_body">
        <div class="author">
            <div class="authorImage skeleton-circle"></div>
            <div class="extra">
                <div class="skeleton-box skeleton-name"></div>
                <div class="skeleton-box skeleton-date"></div>
            </div>
        </div>
        <div class="skeleton-box skeleton-title"></div>
        <div class="cardFooter">
            <div class="skeleton-box skeleton-tag"></div>
        </div>
    </div>
    <div class="divider"></div>
    <div class="cardAction">
        <div class="skeleton-box skeleton-btn"></div>
        <div class="skeleton-box skeleton-btn"></div>
        <div class="skeleton-box skeleton-btn"></div>
    </div>
</div>
<div class="card heightSmall skeleton-card">
    <div class="card_image skeleton-box"></div>
    <div class="card_body">
        <div class="author">
            <div class="authorImage skeleton-circle"></div>
            <div class="extra">
                <div class="skeleton-box skeleton-name"></div>
                <div class="skeleton-box skeleton-date"></div>
            </div>
        </div>
        <div class="skeleton-box skeleton-title"></div>
        <div class="cardFooter">
            <div class="skeleton-box skeleton-tag"></div>
        </div>
    </div>
    <div class="divider"></div>
    <div class="cardAction">
        <div class="skeleton-box skeleton-btn"></div>
        <div class="skeleton-box skeleton-btn"></div>
        <div class="skeleton-box skeleton-btn"></div>
    </div>
</div>
<div class="card heightSmall skeleton-card">
    <div class="card_image skeleton-box"></div>
    <div class="card_body">
        <div class="author">
            <div class="authorImage skeleton-circle"></div>
            <div class="extra">
                <div class="skeleton-box skeleton-name"></div>
                <div class="skeleton-box skeleton-date"></div>
            </div>
        </div>
        <div class="skeleton-box skeleton-title"></div>
        <div class="cardFooter">
            <div class="skeleton-box skeleton-tag"></div>
        </div>
    </div>
    <div class="divider"></div>
    <div class="cardAction">
        <div class="skeleton-box skeleton-btn"></div>
        <div class="skeleton-box skeleton-btn"></div>
        <div class="skeleton-box skeleton-btn"></div>
    </div>
</div>`;
loadingIndicator.classList.add("loading-indicator");
feedContainer.appendChild(loadingIndicator);

// Scroll state management
const SCROLL_POSITION_KEY = 'feedScrollPosition';
let currentPage = 1;
let isLoading = false;
let hasMoreData = true;
let isObserving = false;
let observer;
let lastScrollPosition = 0;
let searchQuery = "";
let prefetchData = null;
let isPrefetching = false;


if (window.location.search) {
    const urlParams = new URLSearchParams(window.location.search);
    searchQuery = `&q=${urlParams.get("q")}`;
}

// Cache configuration
const CACHE_KEY = 'feedCache';
const CACHE_EXPIRY_HOURS = 4;

// Save scroll position before refresh
window.addEventListener('beforeunload', () => {
    localStorage.setItem(SCROLL_POSITION_KEY, mainScroll.scrollTop.toString());
});

// Restore scroll position on load
window.addEventListener('load', () => {
    const savedPosition = localStorage.getItem(SCROLL_POSITION_KEY);
    if (savedPosition) {
        setTimeout(() => {
            mainScroll.scrollTop = parseInt(savedPosition, 10);
            localStorage.removeItem(SCROLL_POSITION_KEY);
        }, 100);
    }
});

// Initialize intersection observer
function initObserver() {
    if (observer) observer.disconnect();
    
    observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isLoading && hasMoreData) {
                    loadFeed();
                }
            });
        },
        {
            root: mainScroll,
            rootMargin: '200px',
            threshold: 0.1
        }
    );

    // Observe the loading indicator
    observer.observe(loadingIndicator);
}

// Throttle scroll events
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

// Track scroll direction and prefetch
mainScroll.addEventListener('scroll', throttle(() => {
    const currentScroll = mainScroll.scrollTop;
    const scrollDirection = currentScroll > lastScrollPosition ? 'down' : 'up';
    lastScrollPosition = currentScroll;
    
    // Only prefetch if scrolling down
if (scrollDirection === 'down' && !isLoading && hasMoreData) {
    const scrollPercentage = (currentScroll / (mainScroll.scrollHeight - mainScroll.clientHeight)) * 100;
    if (scrollPercentage > 60) {
        prefetchNextPage();
    }
    if (scrollPercentage > 70) {
        loadFeed();
    }
}

}, 200));
async function prefetchNextPage() {
    if (isPrefetching || isLoading || !hasMoreData) return;
    isPrefetching = true;
    
    try {
        const response = await fetch(`/getPeopleFeed?page=${currentPage + 1}${searchQuery}`);
        const data = await response.json();

        if (data.success && data.data.length > 0) {
            prefetchData = data;
        } else {
            hasMoreData = false;
        }
    } catch (err) {
        console.error("Prefetch error:", err);
    } finally {
        isPrefetching = false;
    }
}

async function loadFeed() {
    if (isLoading || !hasMoreData) return;
    isLoading = true;
    
    // Show loading indicator
    loadingIndicator.style.display = "block";
    
    let data;

    if (prefetchData) {
        data = prefetchData;
        prefetchData = null;
    } else {
        try {
            const response = await fetch(`/getPeopleFeed?page=${currentPage}${searchQuery}`);
            data = await response.json();

            if (!data.success) {
                console.error(data.error);
                const cachedData = getCachedFeed();
                if (cachedData && currentPage === 1) renderFeed(cachedData, true);
                return;
            }

            if (currentPage === 1) {
                cacheFeedData(data);
            }

        } catch (err) {
            console.error(err);
            const cachedData = getCachedFeed();
            if (cachedData && currentPage === 1) renderFeed(cachedData, true);
            return;
        }
    }
    
    await renderFeed(data, false);

    // Start prefetching next page
    prefetchNextPage();

    isLoading = false;
    loadingIndicator.style.display = "none";
    
    if (!isObserving && currentPage === 1) {
        initObserver();
        isObserving = true;
    }
}

// Cache management functions
function getCachedFeed() {
    const cache = localStorage.getItem(CACHE_KEY);
    if (!cache) return null;
    
    try {
        return JSON.parse(cache);
    } catch (e) {
        console.error("Error parsing cached feed", e);
        return null;
    }
}

function cacheFeedData(data) {
    const cache = {
        data: data,
        timestamp: new Date().getTime()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

function shouldRefreshCache() {
    const cache = getCachedFeed();
    if (!cache) return true;
    
    const cacheAgeHours = (new Date().getTime() - cache.timestamp) / (1000 * 60 * 60);
    return cacheAgeHours > CACHE_EXPIRY_HOURS;
}

// Separate rendering function
async function renderFeed(feedData, isCached) {
    const feedItems = isCached ? feedData.data.data : feedData.data;

    if (feedItems.length === 0) {
        hasMoreData = false;
        if (currentPage === 1) {
            feedContainer.innerHTML = `<div class="card no-data">
                <div class="card_body"> No data available</div></div>`;
        }
        return;
    }

    // Clear existing content only if we're not appending
    if (currentPage === 1) {
        feedContainer.innerHTML = '';
    }

    for (const item of feedItems) {
        const { person, type, title, timestamp } = item;
        const profileDetails = await personProfileDetails(person);
        const isFollowedAccount = await isFollowed(person);
        
        const firstName = profileDetails.first_name || "N/A";
        const lastName = profileDetails.last_name || "N/A";
        const profilePicture = profileDetails.profile_picture || "default.jpg";

        let image = "";
        let fileType = "";
        let is_asfirj = "";
        let smallHeight = ""
        let link = ""
        let followButton = "";
        
        if (isFollowedAccount) {
            followButton = `<button class="cardActionButton" style="color: rgba(255, 150, 0)" onclick="unFollow('${encodeURIComponent(person)}')"><span class="fluent-mdl2--unfollow-user"></span> Unfollow</button>`;
        } else {
            followButton = `<button class="cardActionButton" style="color: rgba(255, 150, 0)" onclick="follow('${encodeURIComponent(person)}')"><span class="fluent-mdl2--follow-user"></span> Follow</button>`;  
        }
        
        switch (type) {
            case "Book":
                image = "/assets/images/book-cover.png";
                is_asfirj = "hidden"
                smallHeight = "heightSmall"
                fileType = "Book";
                link = `/library/b/${item.id}`
                break;
            case "Podcast":
                image = "/assets/images/podcast-icon.png";
                is_asfirj = "hidden"
                smallHeight = "heightSmall"
                fileType = "Podcast";
                link= `/podcasts/${item.id}/${person}`
                break;
            case "Publication Link":
                image = "";
                is_asfirj = "hidden"
                smallHeight = "heightSmall"
                fileType = "Publication Link";
                link = `/link?x=${encodeURI(item.id)}`
                break;
            case "ASFIRJ Publication":
                image = "";
                is_asfirj = "hidden"
                smallHeight = "heightSmall"
                fileType = "ASFIRJ Publication";
                link = `/link?x=${encodeURIComponent(`https://asfirj.org/content/?sid=${item.id}`)}`
                break;
            default:
                image = "default.jpg";
                is_asfirj = "hidden"
                smallHeight = "heightSmall"
                fileType = "Unknown Type";
                break;
        }

        const card = document.createElement("div");
        const date = new Date(timestamp.replace(' ', 'T'));

        const options = {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        const postId = link;
        const formatted = date.toLocaleString('en-US', options).replace(',', ' at');

        card.className = `card ${smallHeight}`;
        card.innerHTML = `
            <div class="card_image ${is_asfirj}">
                <a href="${link}">
                    <img src="${image}" alt="${type}_image">
                </a>
            </div>
            <div class="card_body">
                <div class="author">
                    <a href="@${person}">
                        <div class="authorImage">
                            <img src="${profilePicture}" alt="${person}_image">
                        </div>
                        <div class="extra">
                            <div class="authorName">${firstName} ${lastName} (${person})</div>
                            <div class="date">${formatted}</div>
                        </div>
                    </a>
                    <div class="reaction-container" data-post-id="${postId}" data-post-type="${type}" data-post-person="${person}">
                        <button class="reaction-button">React</button>
                        <div class="reaction-options">
                            <span data-reaction="👍">👍</span>
                            <span data-reaction="❤️">❤️</span>
                            <span data-reaction="👏">👏</span>
                            <span data-reaction="😲">😲</span>
                            <span data-reaction="🤝">🤝</span>
                        </div>
                    </div>
                </div>
                <div class="title"><a href="${link}">${title}</a></div>
                <div class="cardFooter">
                    <div class="itemType">${fileType}</div>
                </div>
            </div>
            <div class="divider"></div>
            <div class="cardAction">
                <button class="cardActionButton"><a href="${link}"><span class="solar--download-bold-duotone"></span> View</a></button>
                ${followButton}
                <button class="cardActionButton" style="color: rgba(255, 150, 0)" onclick="share('${link}')"><span class="solar--share-linear"></span> Share</button>
            </div>
        `;

        const container = card.querySelector('.reaction-container');
        const reactpostId = container.getAttribute('data-post-id');
        const postType = container.getAttribute('data-post-type');

        const button = container.querySelector('.reaction-button');
        const reactoptions = container.querySelector('.reaction-options');

        async function getReactions() {
            return fetch(`/feed/getReactions`, {
                method: "POST",
                headers: {
                    "Content-type": "application/JSON"
                },
                body: JSON.stringify({
                    post_id: reactpostId,
                    post_type: type
                })
            }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                    return {reaction_type: "", reaction_count: 0}
                } else {
                    return data
                }
            })
        }

        const myReaction = await getReactions()
        const myReactionContent = myReaction.reaction_type
        const storedReaction = myReactionContent ? myReactionContent : localStorage.getItem(`reaction-${reactpostId}`);
        const TotalReactions = myReaction.reaction_count
        const reactionCount = document.createElement("div");
        reactionCount.className = "reaction-count";
        let reactionsText = "reaction"
        if (TotalReactions > 1) {
            reactionsText = "reactions"
        } else if (TotalReactions == 0) {
            reactionsText = "reactions"
        }
        reactionCount.innerHTML = `<span>${TotalReactions} ${reactionsText}</span>`;
        container.appendChild(reactionCount);

        if (storedReaction) {
            button.textContent = storedReaction;
        }

        button.addEventListener('click', () => {
            reactoptions.classList.toggle('show');
        });

        reactoptions.querySelectorAll('span').forEach(option => {
            option.addEventListener('click', () => {
                const reaction = option.getAttribute('data-reaction');
                button.textContent = reaction;
                localStorage.setItem(`reaction-${reactpostId}`, reaction);

                reactionCount.innerHTML = `<span>${new Number(TotalReactions)+1} ${reactionsText}</span>`;
                container.appendChild(reactionCount);

                reactoptions.classList.remove('show');
                const reactionData = {
                    reactionType: reaction,
                    post_id: reactpostId,
                    post_type: type,
                    person: person,
                }
                fetch(`/feed/saveReaction`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/JSON"
                    },
                    body: JSON.stringify(reactionData)
                }).then(res => res.json())
                .then(data => {
                    if (data.error) {
                        console.log(data.error)
                    } else {
                        console.log(data.success)
                    }
                })
            });
        });

        feedContainer.appendChild(card);
    }

    currentPage++;
}

// Initial load
loadFeed();

// Keep the rest of your existing functions (follow, unFollow, isFollowed, personProfileDetails, fetchLinkPreview, share, etc.)



async function follow(username) {
    try {
        const response = await fetch("/follow", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ followed: username }),
        });

        const result = await response.json();

        if (result.success) {
            const button = document.querySelector(`button[onclick="follow('${username}')"]`);
            if (button) {
                button.innerHTML = `<span class="fluent-mdl2--unfollow-user"></span> Unfollow`;
                button.setAttribute("onclick", `unFollow('${username}')`);
            }
        } else {
            alert("Failed to follow. Please try again.");
        }
    } catch (error) {
        console.error("Error following user:", error);
    }
}


async function unFollow(username) {
    try {
        const response = await fetch("/unfollow", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ unfollowed: username }),
        });

        const result = await response.json();

        if (result.success) {
            const button = document.querySelector(`button[onclick="unFollow('${username}')"]`);
            if (button) {
                button.innerHTML = `<span class="fluent-mdl2--follow-user"></span> Follow`;
                button.setAttribute("onclick", `follow('${username}')`);
            }
        } else {
            alert("Failed to unfollow. Please try again.");
        }
    } catch (error) {
        console.error("Error unfollowing user:", error);
    }
}



// Chwck if user is followed 
async function isFollowed(username) {
    const res = await fetch(`/check/validate/follower/${username}`, {
        method: "GET"
      });
      const json = await res.json();
      return json.message === "following" ? true : false;

}
async function personProfileDetails(username) {
    try {
        const res = await fetch(`/p/s/v/details/${username}`);
        const data = await res.json();
        return data.userDetails || {};
    } catch (error) {
        console.error("Error fetching profile details:", error);
        return {};
    }
}

async function fetchLinkPreview(url) {
    try {
        const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}&meta=true`);
        const data = await response.json();
        return data.status === "success" ? data.data.image?.url || "" : "";
    } catch (error) {
        console.error(`Error fetching metadata for ${url}:`, error);
        return "";
    }
}


function share(contentLink) {
    // 1) populate each platform URL
    asfischolar = "https://asfischolar.org" + contentLink;
    document.getElementById("fbShare").href =
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(asfischolar)}`;
    document.getElementById("waShare").href =
      `https://api.whatsapp.com/send?text=${encodeURIComponent(asfischolar)}`;
    document.getElementById("liShare").href =
      `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(asfischolar)}`;
    document.getElementById("xShare").href =
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(asfischolar)}`;

    // 2) wire up Copy link
    const copyBtn = document.getElementById("copyShare");
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(asfischolar)
        .then(() => copyBtn.textContent = "Copied!")
        .catch(() => copyBtn.textContent = "Failed");
      setTimeout(() => copyBtn.innerHTML = '<span class="gravity-ui--link"></span><div>Copy link</div>', 1500);
    };

    // 3) show modal
    document.getElementById("shareModal").style.display = "flex";
  }

  function closeShareModal() {
    document.getElementById("shareModal").style.display = "none";
  }

  const overlays = document.getElementsByClassName("share-modal__overlay");
if (overlays.length > 0) {
  overlays[0].addEventListener("click", e => {
    if (e.target === overlays[0]) {
      overlays[0].style.display = "none";
    }
  });
}