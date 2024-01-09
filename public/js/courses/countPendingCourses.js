const TotalPending = document.getElementById("TotalPending")

fetch("/admin/getTotalPendingCourses", ()=>{
    method: "GET"
}).then(res => res.json())
.then(data =>{
    const PendingCount = data.PendingCoursesCount
    TotalPending.innerHTML = `<span>${PendingCount}</span>`
})