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
for (let i = 0; i < 10; i++) {
    feedContainer.innerHTML += `<div class="dummy-card-container">
  <!-- Single card item -->
  <div class="dummy-card">
    <div class="dummy-card_image"></div>
    <div class="dummy-card_body">
      <div class="dummy-title"></div>
      <!-- Start Author -->
      <div class="dummy-author">
        <div class="dummy-authorImage"></div>
        <div class="dummy-authorName"></div>
      </div>
      <!-- End author -->

      <!-- Card footer -->
      <div class="dummy-cardFooter">
        <div class="dummy-date"></div>
        <div class="dummy-itemType"></div>
      </div>
      <!-- End card footer -->
    </div>
  </div>
  <!-- End single card item -->
  <div class="dummy-divider"></div>
</div>
`
}
fetch(`/getPeopleFeed`, {
    method: "GET",
})
    .then((res) => res.json())
    .then((data) => {
        if (data.success) {
            const feedItems = data.data; // Assuming data.data contains the feed array
            if (feedItems.length > 0) {


                // Clear any existing content in the feed container
                feedContainer.innerHTML = '';

                // Loop through each feed item
                feedItems.forEach(async (item) => {
                    const { person, books, podcasts, links, publications } = item;

                    const profileDetails = await personProfieDetails(person)
                    const email = profileDetails.email ? profileDetails.email : "N/A"
                    const firstName = profileDetails.first_name ? profileDetails.first_name : "N/A"
                    const lastname = profileDetails.last_name ? profileDetails.last_name : "N/A"
                    const profilePicture = profileDetails.profilePicture ? profileDetails.profile_picture : "https://res.cloudinary.com/dll8awuig/image/upload/v1705444097/dc69h8mggh01bvlvbowh.jpg"

                    let profilePhoto = profilePicture
                    if (profilePicture === "avater.jpg") {
                        profilePhoto = "https://res.cloudinary.com/dll8awuig/image/upload/v1705444097/dc69h8mggh01bvlvbowh.jpg"
                    }


                    // Helper function to create a card
                    const createCard = (title, itemType, link, style, image, time) => `
                    <div class="card">
                        <div class="card_image" ${style}>
                            <a href="${link}"> <img src="${image}" alt="${itemType}_image">
                            </a>
                        </div>
                        <div class="card_body">
                            <div class="title">
                            <a href="${link}">${title}</a></div>
                            <!-- Author Section -->
                            <div class="author">
                                <div class="authorImage">
                                    <img src="${profilePicture}" alt="${person}_image">
                                </div>
                                <div class="authorName">${firstName} ${lastname} (${person})</div>
                            </div>
                            <!-- Card Footer -->
                            <div class="cardFooter">
                                <div class="date">${time}</div>
                                <div class="itemType">${itemType}</div>
                            </div>
                        </div>
                    </div>
                    <div class="divider"></div>`;

                    // Append books
                    books.forEach((book) => {
                        const link = `/library/b/${book.book_id}`
                        const style = "style=display:none;"
                        const image = ""
                        const time = book.datePublished
                        feedContainer.innerHTML += createCard(book.book_title || "Untitled Book", "Book", link, style, image, time);
                    });

                    // Append podcasts
                    podcasts.forEach((podcast) => {
                        const style = "style=display:none;"
                        const image = ""

                        const time = formatTime(podcast.timestamp)
                        const link = `/podcasts/${podcast.buffer}/${podcast.file_owner}`
                        feedContainer.innerHTML += createCard(podcast.podcast_title || "Untitled Podcast", "Podcast", link, style, image, time);
                    });



                    // Append links with metadata
                    async function appendLinks(links) {
                        for (const link of links) {
                            const linkHref = link.href; // Replace with the actual link property
                            let style = "";
                            const time = formatTime(link.timestamp);

                            // Fetch the preview image
                            const image = await fetchLinkPreview(linkHref);
                            if(image === "<empty string>" || image === "" || !image){
                                style = "style=display:none;"
                            }
                            
                            feedContainer.innerHTML += createCard(
                                link.link_title || "Untitled Link", // Title
                                "Publication Link",                            // Type
                                linkHref,                          // Link
                                style,                             // Additional Style
                                image,                             // Preview Image
                                time                               // Timestamp
                            );
                        }
                    }

                    appendLinks(links)

                    // Append publications
                    publications.forEach((publication) => {
                        const link = `https://asfirj.org/content/?sid=${publication.buffer}`
                        const style = ""
                        const time = formatTime(publication.date_uploaded)
                        const image = "https://asfirj.org/assets/images/logoIcon/logo.png"
                        feedContainer.innerHTML += createCard(publication.manuscript_full_title || "Untitled Publication", "ASFIRJ Publication", link, style, image, time);
                    });
                });
            } else {
                feedContainer.innerHTML = "Follow Scholars to see content"
            }
        } else {
            console.error(data.error);
            feedContainer.innerHTML = `<p class="error">Failed to load feed: ${data.error}</p>`;
        }
    })
    .catch((err) => {
        console.error(err);
        feedContainer.innerHTML = `<p class="error">An error occurred while fetching the feed.</p>`;
    });


// 