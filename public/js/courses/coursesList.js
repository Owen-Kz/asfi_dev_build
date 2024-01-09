const CourseListContainer = document.getElementById("course_list_Container")
const footerContainer = document.getElementById("footer_container")

function NewPage(page){
    fetch(`/admin/getAllCourses?page=${page}`, ()=>{
        method: "GET"
    }).then(res => res.json())
    .then(data =>{
        const CoursesList = JSON.parse(data.courses_list)
        UpdateCoursesUI(CoursesList, data)
    })
}


NewPage(1)


// Search The Courses 
const searchCourses = document.getElementById("searchCourses")
const search = document.getElementById("search") 

searchCourses.addEventListener("submit", (e)=>{
    e.preventDefault()
    fetch(`/admin/getAllCourses?q=${search.value}`, ()=>{
        method:"GET"
    }).then(res => res.json())
    .then(data =>{
        const SearchList = JSON.parse(data.courses_list)
        UpdateCoursesUI(SearchList, data)
    })
})


// Sort the Course By status 
const sort_by = document.getElementById("sort_by")

sort_by.addEventListener("change", function(e){
    e.preventDefault()
    
    if(sort_by.value != ""){
        fetch(`/admin/getAllCourses?filter=${sort_by.value}`, ()=>{
            method: "GET"
        }).then(res => res.json())
        .then(data =>{
            const FilterList = JSON.parse(data.courses_list)
            UpdateCoursesUI(FilterList, data)
        })
    }else{
        NewPage(1)
    }
})