const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time; // Difference in milliseconds
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
        return "just now";
    } else if (diffMinutes < 60) {
        return `${diffMinutes} min${diffMinutes > 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
    } else if (diffDays < 7) {
        return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else {
        // When it's more than 7 days, return the formatted date
        const options = { year: "numeric", month: "short", day: "numeric" };
        return time.toLocaleDateString(undefined, options); // Adjusts to local timezone and format
    }
};

async function personProfieDetails(username) {
    return fetch(`/p/s/v/details/${username}`, {
        method: "GET"
    }).then(res => res.json())
        .then(data => {
            if (data.userDetails) {
                return data.userDetails
            } else {
                return []
            }
        })
}

// Function to fetch OG metadata
async function fetchLinkPreview(url) {
    try {
        const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}&meta=true`);
        const data = await response.json();
        if (data.status === "success") {
            return data.data.image?.url || ""; // Return the OG:image if available
        } else {
            console.error(`Failed to fetch metadata for ${url}`);
            return ""; // Return empty if no image
        }
    } catch (error) {
        console.error(`Error fetching metadata for ${url}:`, error);
        return ""; // Return empty in case of an error
    }
}
const feedContainer = document.getElementById("feedContainer");
const paginationContainer = document.getElementById("paginationContainer"); // A div to hold pagination buttons
let currentPage = new URLSearchParams(window.location.search).get("page") || 1;

async function loadFeed(page = 1) {
    feedContainer.innerHTML = `<p>Loading...</p>`;

    fetch(`/getPeopleFeed?page=${page}`, { method: "GET" })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                const feedItems = data.data;
                feedContainer.innerHTML = ''; // Clear previous content

                if (feedItems.length > 0) {
                    feedItems.forEach(async (item) => {
                        const { person, books, podcasts, links, publications } = item;
                        const profileDetails = await personProfieDetails(person);
                        const firstName = profileDetails.first_name || "N/A";
                        const lastName = profileDetails.last_name || "N/A";
                        const profilePicture = profileDetails.profile_picture || "default.jpg";

                        const createCard = (title, itemType, link, style, image, time) => `
                            <div class="card">
                                <div class="card_image" ${style}>
                                    <a href="${link}"> <img src="${image}" alt="${itemType}_image"> </a>
                                </div>
                                <div class="card_body">
                                    <div class="title"><a href="${link}">${title}</a></div>
                                    <div class="author">
                                        <div class="authorImage">
                                            <img src="${profilePicture}" alt="${person}_image">
                                        </div>
                                        <div class="authorName">${firstName} ${lastName} (${person})</div>
                                    </div>
                                    <div class="cardFooter">
                                        <div class="date">${time}</div>
                                        <div class="itemType">${itemType}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="divider"></div>`;

                        books.forEach((book) => {
                            feedContainer.innerHTML += createCard(book.book_title || "Untitled Book", "Book", `/library/b/${book.book_id}`, "style=display:none;", "", book.datePublished);
                        });

                        podcasts.forEach((podcast) => {
                            feedContainer.innerHTML += createCard(podcast.podcast_title || "Untitled Podcast", "Podcast", `/podcasts/${podcast.buffer}/${podcast.file_owner}`, "style=display:none;", "", formatTime(podcast.timestamp));
                        });

                        async function appendLinks(links) {
                            for (const link of links) {
                                const image = await fetchLinkPreview(link.link_href);
                                feedContainer.innerHTML += createCard(link.link_title || "Untitled Link", "Publication Link", link.link_href, image ? "" : "style=display:none;", image, formatTime(link.timestamp));
                            }
                        }
                        appendLinks(links);

                        publications.forEach((publication) => {
                            feedContainer.innerHTML += createCard(publication.manuscript_full_title || "Untitled Publication", "ASFIRJ Publication", `https://asfirj.org/content/?sid=${publication.buffer}`, "", "https://asfirj.org/assets/images/logoIcon/logo.png", formatTime(publication.date_uploaded));
                        });
                    });
                } else {
                    feedContainer.innerHTML = "Follow Scholars to see content";
                }

                // Update pagination controls
                updatePagination(page, data.hasMore);
            } else {
                console.error(data.error);
                feedContainer.innerHTML = `<p class="error">Failed to load feed: ${data.error}</p>`;
            }
        })
        .catch((err) => {
            console.error(err);
            feedContainer.innerHTML = `<p class="error">An error occurred while fetching the feed.</p>`;
        });
}

// Function to update pagination buttons
function updatePagination(currentPage, hasMore) {
    paginationContainer.innerHTML = `
        ${currentPage > 1 ? `<button onclick="changePage(${currentPage - 1})">Previous</button>` : ""}
        ${hasMore ? `<button onclick="changePage(${Number(currentPage) + 1})">Next</button>` : ""}
    `;
}

// Function to change page
function changePage(page) {
    window.location.search = `?page=${page}`;
}

// Load initial feed
loadFeed(currentPage);
