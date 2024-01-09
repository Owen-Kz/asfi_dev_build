const TotalCourses = document.getElementById("TotalCourses")

fetch("/admin/getTotalCourses", ()=>{
    method: "GET"
}).then(res => res.json())
.then(data =>{
    const CoursesCount = data.CoursesCount
    TotalCourses.innerHTML = `<span>${CoursesCount}</span>`
})