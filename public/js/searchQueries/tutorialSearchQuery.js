var searchButton = document.querySelector(".fa-search")
const SearchBar = document.getElementById("searchTutorial")
const searchForm = document.getElementById("searchForm")

let tutorials_Data = []
let tutorialS_SEARCH_ARRAY = []

// const Tutorials = document.getElementById("AllTutorials").value
// const TutorialArray = JSON.parse(Tutorials)

const tutorialS_DATA_ARRAY = document.getElementById("AllTutorials").value
tutorials_Data = JSON.parse(tutorialS_DATA_ARRAY)


function removeExisitng() {
    tutorials_Data = []
    tutorialS_SEARCH_ARRAY = []
}


searchForm.addEventListener("submit", function(e){
    e.preventDefault();
    removeExisitng(); // Clear the arrays before fetching new data
    fetch(`/feedTutorials?searchTutorial=${SearchBar.value}`, {
        method: "GET"
    }).then(res => res.json())
    .then(data => {
        const TutorialsArray = JSON.parse(data.AllTutorials)
        const TotalPages = data.totalPagesTutorials
        const CurrentPage = data.currentPageTutorials
        const PrevPage = Math.floor(parseInt(CurrentPage) - 1)
        const NexxtPage = Math.floor(parseInt(CurrentPage) + 1)
    
    
        updateUIWithData(TutorialsArray) 
    
        if(TotalPages > 0){
            // Update the pagination UI
           const paginationHTML = paginationFotTutorials(CurrentPage, TotalPages, PrevPage, NexxtPage);
           footerContainer.innerHTML = paginationHTML;
        }
    })
})
searchButton.addEventListener("click",()=>{
    removeExisitng(); // Clear the arrays before fetching new data
    fetch(`/feedTutorials?searchTutorial=${SearchBar.value}`, {
        method: "GET"
    }).then(res => res.json())
    .then(data => {
        const TutorialsArray = JSON.parse(data.AllTutorials)
        const TotalPages = data.totalPagesTutorials
        const CurrentPage = data.currentPageTutorials
        const PrevPage = Math.floor(parseInt(CurrentPage) - 1)
        const NexxtPage = Math.floor(parseInt(CurrentPage) + 1)
    
    
        updateUIWithData(TutorialsArray) 
    
        if(TotalPages > 0){
            // Update the pagination UI
           const paginationHTML = paginationFotTutorials(CurrentPage, TotalPages, PrevPage, NexxtPage);
           footerContainer.innerHTML = paginationHTML;
        }
    })
})

// Call updateUIWithData when the DOM is ready, or when needed
// document.addEventListener("DOMContentLoaded", function () {
//     updateUIWithData(tutorials_Data);
// });


