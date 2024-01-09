

function NewPage(page){
fetch(`/admin/allScholars?page=${page}`, ()=>{
    method:"GET"
}).then(res => res.json())
.then(data =>{
    const ScholarsList = JSON.parse(data.scholars_list)
    UpdateScholarsList(ScholarsList, data)
})
}

NewPage(1)


// Search For scholars by name 
const SearchSCholars = document.getElementById("searchScholarsForm")
const SearchScholarsQuery = document.getElementById("searchScholarsQuery")


SearchSCholars.addEventListener("submit", function(e){
    e.preventDefault();

if(SearchScholarsQuery.value !=""){
fetch(`/admin/allScholars?q=${SearchScholarsQuery.value}`, ()=>{
    method:"GET"
}).then(res => res.json())
.then(data =>{
    const ScholarsList = JSON.parse(data.scholars_list)
    UpdateScholarsList(ScholarsList, data)
})
}else{
    NewPage(1)
}
})
