const CompletedCourseContainer = document.getElementById("completedCourseCount")

fetch(`/admin/dashboard/countCourses/completed`, ()=>{
    method : "GET"
}).then(res => res.json())
.then(data =>{

    CompletedCourseContainer.removeAttribute("data-purecounter-end")
    const CourseCount = data.coursesCount
    CompletedCourseContainer.setAttribute("data-purecounter-end", CourseCount)
    CompletedCourseContainer.innerHTML = `<span>${CourseCount}</span`
})