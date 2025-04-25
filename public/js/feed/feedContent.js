const feedContainer = document.getElementById("feedContainer");
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
loadingIndicator.classList.add("loading-indicator"); // Style this with CSS
feedContainer.appendChild(loadingIndicator);

let currentPage = 1;
let isLoading = false;
let hasMoreData = true;

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
let searchQuery = "";
if (window.location.search) {
    const urlParams = new URLSearchParams(window.location.search);
    searchQuery = `&q=${urlParams.get("q")}`;
}

async function loadFeed() {
    if (isLoading || !hasMoreData) return;
    isLoading = true;
    loadingIndicator.style.display = "block"; // Show loading

    try {
        const response = await fetch(`/getPeopleFeed?page=${currentPage}${searchQuery}`);
        const data = await response.json();

        if (!data.success) {
            console.error(data.error);
            return;
        }

        const feedItems = data.data;

        if (feedItems.length === 0) {
            hasMoreData = false; // No more data to load
            // feedContainer.removeEventListener("scroll", loadFeed);
            feedContainer.innerHTML = `<div class="card no-data">
            <div class="card_body"> No more data to load</div></div>`;
            return;
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
            }else{
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
                    // image = await fetchLinkPreview(link);
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

            feedContainer.appendChild(card);
            
        }

        currentPage++; // Move to the next page
    } catch (err) {
        console.error(err);
    } finally {
        isLoading = false;
        loadingIndicator.style.display = "none"; // Hide loading
    }
}

// Scroll event inside feedContainer
feedContainer.addEventListener("scroll", () => {
    if (feedContainer.scrollTop + feedContainer.clientHeight >= feedContainer.scrollHeight - 50) {
        loadFeed();
    }
});

// Load initial feed
loadFeed();


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