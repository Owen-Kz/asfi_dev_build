const feedContainer = document.getElementById("feedContainer");
const loadingIndicator = document.createElement("div"); 
loadingIndicator.innerHTML = "Loading...";
loadingIndicator.classList.add("loading-indicator"); // Style this with CSS
feedContainer.appendChild(loadingIndicator);

let currentPage = 1;
let isLoading = false;
let hasMoreData = true;

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

async function loadFeed() {
    if (isLoading || !hasMoreData) return;
    isLoading = true;
    loadingIndicator.style.display = "block"; // Show loading

    try {
        const response = await fetch(`/getPeopleFeed?page=${currentPage}`);
        const data = await response.json();

        if (!data.success) {
            console.error(data.error);
            return;
        }

        const feedItems = data.data;

        if (feedItems.length === 0) {
            hasMoreData = false; // No more data to load
        }

        for (const item of feedItems) {
            const { person, type, title, link, timestamp } = item;
            const profileDetails = await personProfileDetails(person);
            const firstName = profileDetails.first_name || "N/A";
            const lastName = profileDetails.last_name || "N/A";
            const profilePicture = profileDetails.profile_picture || "default.jpg";

            let image = "";
            let fileType = "";
            let is_asfirj = "";

            switch (type) {
                case "Book":
                    image = "/assets/images/book-cover.png";
                    fileType = "Book";
                    break;
                case "Podcast":
                    image = "/assets/images/podcast-icon.png";
                    fileType = "Podcast";
                    break;
                case "Publication Link":
                    image = await fetchLinkPreview(link);
                    fileType = "Publication Link";
                    break;
                case "ASFIRJ Publication":
                    image = "";
                    is_asfirj = "hidden"
                    fileType = "ASFIRJ Publication";
                    break;
                default:
                    image = "default.jpg";
                    fileType = "Unknown Type";
                    break;
            }

            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <div class="card_image ${is_asfirj}">
                    <a href="${link}">
                        <img src="${image}" alt="${type}_image">
                    </a>
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
                        <div class="date">${formatTime(timestamp)}</div>
                        <div class="itemType">${fileType}</div>
                    </div>
                </div>
                <div class="divider"></div>
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
