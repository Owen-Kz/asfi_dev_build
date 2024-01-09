const InstructorsTotalContainer = document.getElementById("InstructorsTotalCount")

fetch(`/admin/dashboard/instructors/registeredCount`, ()=>{
    method : "GET"
}).then(res => res.json())
.then(data =>{
    const TotalCount = data.TotalCount
    
    InstructorsTotalContainer.setAttribute("data-purecounter-end", TotalCount)
    InstructorsTotalContainer.innerHTML = `<span>${TotalCount}</span`
})