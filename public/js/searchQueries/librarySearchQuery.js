var searchButton = document.querySelector(".fa-search")
const SearchBar = document.getElementById("searchLibrary")

let Books_Data = []
let BOOKS_SEARCH_ARRAY = []

const BOOKS_DATA_ARRAY = document.getElementById("books_Array").value
Books_Data = JSON.parse(BOOKS_DATA_ARRAY)


function removeExisitng() {
    Books_Data = []
    BOOKS_SEARCH_ARRAY = []
}


searchForm.addEventListener("submit", function(e){
    e.preventDefault();

    removeExisitng(); // Clear the arrays before fetching new data
    fetch(`/books/${SearchBar.value}`, {
        method: "GET"
    }).then(res => res.json())
    .then(data => {
        if(data.message == "No data Match your search"){
            alert(data.message)
        }
        else if(data.message = "Success"){
            BOOKS_SEARCH_ARRAY = JSON.parse(data.BOOKS_ARRAY_JSON);
            updateUIWithData(BOOKS_SEARCH_ARRAY);
        }
    })
})
searchButton.addEventListener("click",()=>{
    removeExisitng(); // Clear the arrays before fetching new data
    fetch(`/books/${SearchBar.value}`, {
        method: "GET"
    }).then(res => res.json())
    .then(data => {
        if(data.message == "No data Match your search"){
            alert(data.message)
        }
        else if(data.message = "Success"){
            BOOKS_SEARCH_ARRAY = JSON.parse(data.BOOKS_ARRAY_JSON);
            updateUIWithData(BOOKS_SEARCH_ARRAY);
        } 
    })
})

// Call updateUIWithData when the DOM is ready, or when needed
document.addEventListener("DOMContentLoaded", function () {
    updateUIWithData(Books_Data);
});


