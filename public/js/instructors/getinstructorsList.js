

function NewPage(page){
    fetch(`/admin/allInstructors?page=${page}`, ()=>{
        method:"GET"
    }).then(res => res.json())
    .then(data =>{
        const InstructorsList = JSON.parse(data.Instructors_list)
        UpdateInstructorsList(InstructorsList, data)
    })
    }
    
    NewPage(1)
    
    
    // Search For Instructors by name 
    const SearchInstructors = document.getElementById("searchInstructorsForm")
    const SearchInstructorsQuery = document.getElementById("searchInstructorsQuery")
    
    
    SearchInstructors.addEventListener("submit", function(e){
        e.preventDefault();
    
    if(SearchInstructorsQuery.value !=""){
    fetch(`/admin/allInstructors?q=${SearchInstructorsQuery.value}`, ()=>{
        method:"GET"
    }).then(res => res.json())
    .then(data =>{
        const InstructorsList = JSON.parse(data.Instructors_list)
        UpdateInstructorsList(InstructorsList, data)
    })
    }else{
        NewPage(1)
    }
    })
    