const EnroledCourseContainer = document.getElementById("EnrolledCourseCount")

window.addEventListener("DOMContentLoaded", function(){

fetch(`/admin/dashboard/countCourses/enrolled`, ()=>{
    method : "GET"
}).then(res => res.json())
.then(data =>{
    const CourseCount = data.coursesCount


    if(EnroledCourseContainer.innerHTML != CourseCount){
       EnroledCourseContainer.setAttribute("data-purecounter-start", 0)
        EnroledCourseContainer.setAttribute("data-purecounter-end", CourseCount)

        EnroledCourseContainer.innerHTML = ""
    EnroledCourseContainer.innerHTML = `<span>${CourseCount}</span`
     
    }
   
})

})
