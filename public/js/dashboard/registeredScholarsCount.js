const ScholarsTotalContainer = document.getElementById("ScholarsTotalCount")

fetch(`/admin/dashboard/scholars/registeredCount`, ()=>{
    method : "GET"
}).then(res => res.json())
.then(data =>{
    const TotalCount = data.TotalCount
    
    ScholarsTotalContainer.setAttribute("data-purecounter-end", TotalCount)
    ScholarsTotalContainer.innerHTML = `<span>${TotalCount}</span`
})