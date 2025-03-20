var searchButton = document.querySelector(".fa-search");
const SearchBar = document.getElementById("searchPodcast");

let PodcastArray = [];
let PODCAST_SEARCH_ARRAY = [];

const PodcastContainer = document.getElementById("podcast_container");
const PodcastArrayContainer = document.getElementById("podcast_array_container");

async function GetAllPodcasts() {
    return fetch(`/getAllPodcasts`, {
        method: "POST",
        headers: {
            "Content-type": "application/JSON"
        }
    }).then(res => res.json())
    .then(data => {
        if (data.success) {
            return data.PODCAST_ARRAY;
        } else {
            return [];
        }
    });
}

async function initializePage() {
    PodcastArray = await GetAllPodcasts();
 
    
    if (!PodcastContainer) {
        console.error("PodcastContainer is not defined.");
        return;
    }
    
    if (typeof updateUIWithData === "function") {
        updateUIWithData(PodcastArray);
    } else {
        console.error("updateUIWithData function is not defined.");
    }
}

function removeExisitng() {
    PodcastArray = [];
    PODCAST_SEARCH_ARRAY = [];
}

searchForm.addEventListener("submit", function(e) {
    e.preventDefault();
    removeExisitng(); // Clear the arrays before fetching new data
    fetch(`/podcasts/${SearchBar.value}`, {
        method: "GET"
    }).then(res => res.json())
    .then(data => {
        if (data.message == "No data Match your search") {
            alert(data.message);
        } else if (data.message === "Success") {
            PODCAST_SEARCH_ARRAY = JSON.parse(data.PODCAST_ARRAY_JSON);
            updateUIWithData(PODCAST_SEARCH_ARRAY);
        }
    });
});

searchButton.addEventListener("click", () => {
    removeExisitng(); // Clear the arrays before fetching new data
    fetch(`/podcasts/${SearchBar.value}`, {
        method: "GET"
    }).then(res => res.json())
    .then(data => {
        if (data.message == "No data Match your search") {
            alert(data.message);
        } else if (data.message === "Success") {
            PODCAST_SEARCH_ARRAY = JSON.parse(data.PODCAST_ARRAY_JSON);
            updateUIWithData(PODCAST_SEARCH_ARRAY);
        }
    });
});

// Call initializePage when the DOM is ready
document.addEventListener("DOMContentLoaded", function () {
    initializePage();
});
