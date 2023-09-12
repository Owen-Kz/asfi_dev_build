var searchButton = document.querySelector(".fa-search")
const SearchBar = document.getElementById("searchTutorial")

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
    fetch(`/tutorial/${SearchBar.value}`, {
        method: "GET"
    }).then(res => res.json())
    .then(data => {
        if(data.message == "No data Match your search"){
            alert(data.message)
        }
        else if(data.message = "Success"){
            tutorialS_SEARCH_ARRAY = JSON.parse(data.tutorialS_ARRAY_JSON);
            updateUIWithData(tutorialS_SEARCH_ARRAY);
        }
    })
})
searchButton.addEventListener("click",()=>{
    removeExisitng(); // Clear the arrays before fetching new data
    fetch(`/tutorial/${SearchBar.value}`, {
        method: "GET"
    }).then(res => res.json())
    .then(data => {
        if(data.message == "No data Match your search"){
            alert(data.message)
        }
        else if(data.message = "Success"){
            tutorialS_SEARCH_ARRAY = JSON.parse(data.tutorialS_ARRAY_JSON);
            updateUIWithData(tutorialS_SEARCH_ARRAY);
        } 
    })
})

// Call updateUIWithData when the DOM is ready, or when needed
document.addEventListener("DOMContentLoaded", function () {
    updateUIWithData(tutorials_Data);
});


