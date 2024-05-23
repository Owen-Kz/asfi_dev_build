const discoverAccountsContainer = document.getElementById("DiscoverAccounts")
const Owner  = document.getElementById("Owner").value
const course_id_container = document.getElementById("course_id")
const category_id_container = document.getElementById("category")


fetch(`/${Owner}/getCoursesForDropdown`, ()=>{
    method:"GET"
})
.then(res => res.json())
.then(data =>{
    if(JSON.parse(data.courseData).length > 0){
      
        const CoursesArray = JSON.parse(data.courseData)

        CoursesArray.forEach(course => {
            const CourseName = course.course_name
            const CourseID = course.course_id

            course_id_container.innerHTML +=`<option value="${CourseID}">${CourseName}</option>`
        });
    }

})

// get The Tutorial Categories 
fetch(`/getCategoriesForDropdown`, ()=>{
    method:"GET"
})
.then(res => res.json())
.then(data =>{
    if(JSON.parse(data.categoryData).length > 0){
        
      
        const categoryArray = JSON.parse(data.categoryData)

        categoryArray.forEach(category => {
            const CategoryTitle = category.category_title

            category_id_container.innerHTML +=`<option value="${CategoryTitle}">${CategoryTitle}</option>`
        });
    }

})





