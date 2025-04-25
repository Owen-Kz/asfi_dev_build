var searchButton = document.querySelector(".fa-search")

let Scholar_Data = []
let Scholar_SEARCH_ARRAY = []

function removeExisitng() {
    Scholar_Data = []
    Scholar_SEARCH_ARRAY = []
}
if(SearchForm){
searchForm.addEventListener("submit", function(e){
    e.preventDefault();
    removeExisitng(); // Clear the arrays before fetching new data
    fetch(`/scholars/${SearchBar.value}`, {
        method: "GET"
    }).then(res => res.json())
    .then(data => {
        if(data.message == "No data Match your search"){
            alert(data.message)
        }
        else if(data.message = "Success"){
            Scholar_SEARCH_ARRAY = JSON.parse(data.ScholarsSearchData);
            updateDiscoverUI(Scholar_SEARCH_ARRAY);
        }
    })
})


searchButton.addEventListener("click",()=>{
    removeExisitng(); // Clear the arrays before fetching new data
    fetch(`/scholars/${SearchBar.value}`, {
        method: "GET"
    }).then(res => res.json())
    .then(data => {
        if(data.message == "No data Match your search"){
            alert(data.message)
        }
        else if(data.message = "Success"){
            Scholar_SEARCH_ARRAY = JSON.parse(data.ScholarsSearchData);
            updateDiscoverUI(Scholar_SEARCH_ARRAY);
        } 
    })
})
}