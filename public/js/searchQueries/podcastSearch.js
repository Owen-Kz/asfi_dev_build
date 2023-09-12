var searchButton = document.querySelector(".fa-search")
const SearchBar = document.getElementById("searchPodcast")

let PodcastArray = []
let PODCAST_SEARCH_ARRAY = []


const PodcastContainer = document.getElementById("podcast_container")
const PodcastArrayContainer = document.getElementById("podcast_array_container").value
PodcastArray = JSON.parse(PodcastArrayContainer)



function removeExisitng() {
    PodcastArray = [];
    PODCAST_SEARCH_ARRAY = [];
}




searchForm.addEventListener("submit", function(e){
    e.preventDefault();

    removeExisitng(); // Clear the arrays before fetching new data
    fetch(`/podcasts/${SearchBar.value}`, {
        method: "GET"
    }).then(res => res.json())
    .then(data => {
 

        if(data.message == "No data Match your search"){
            alert(data.message)
        }
        else if(data.message = "Success"){
            PODCAST_SEARCH_ARRAY = JSON.parse(data.PODCAST_ARRAY_JSON);
            updateUIWithData(PODCAST_SEARCH_ARRAY);
        }
     
          
        })
})
searchButton.addEventListener("click",()=>{
    removeExisitng(); // Clear the arrays before fetching new data
    fetch(`/podcasts/${SearchBar.value}`, {
        method: "GET"
    }).then(res => res.json())
    .then(data => {
 

        if(data.message == "No data Match your search"){
            alert(data.message)
        }
        else if(data.message = "Success"){
            PODCAST_SEARCH_ARRAY = JSON.parse(data.PODCAST_ARRAY_JSON);
            updateUIWithData(PODCAST_SEARCH_ARRAY);
        }
     
          
        })
})

// Call updateUIWithData when the DOM is ready, or when needed
document.addEventListener("DOMContentLoaded", function () {
    updateUIWithData(PodcastArray);
});


