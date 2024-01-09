// Fetch Total number of Resources on the platform
const total_resources_count = document.getElementById("total_resources_count")
const total_active_resources = document.getElementById("total_active_resources")
const total_pending_resources = document.getElementById("total_pending_resources")

fetch("/resources/totalResources", ()=>{
    method:"GET"
}).then(res => res.json())
.then(data =>{
    const TotalResourcesCount = data.TotalResourcesCount
    total_resources_count.innerText = TotalResourcesCount
})

// GET TOTAl Active Resources 
fetch("/resources/active", ()=>{
    method:"GET"
}).then(res => res.json())
.then(data =>{
    const TotalActiveResources = data.TotalActiveResources
    total_active_resources.innerText = TotalActiveResources
})

// GET All Peding Resource Requests
fetch("/resources/pending", ()=>{
    method:"GET"
}).then(res => res.json())
.then(data =>{
    const TotalPendingResources = data.TotalPendingResources
    total_pending_resources.innerText  = TotalPendingResources
})