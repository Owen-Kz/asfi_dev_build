const TotalActivated = document.getElementById("TotalActivated")

fetch("/admin/getTotalActivatedCourses", ()=>{
    method: "GET"
}).then(res => res.json())
.then(data =>{
    const ActivatedCount = data.ActivatedCoursesCount
    TotalActivated.innerHTML = `<span>${ActivatedCount}</span>`
})