


let TotalPendingRequests 


const PendingResourcesContainer = document.getElementById("PendingTotalPendingRequests")


// CountPening Books 
fetch(`/admin/dashboard/count/pending/resources`, ()=>{
    method : "GET"
}).then(res => res.json())
.then(data =>{
    const Counts = JSON.parse(data.queryArray)
    if(Counts.length > 0){
const PendingBooksCount = Counts[0]
    const PendingTutorialsCount   = Counts[1]
    const PendingPodcastCount = Counts[2]
    const pendingLinksCount = Counts[3]
    const pendingResourcessCount = Counts[4]

    TotalPendingRequests = Math.floor(PendingTutorialsCount + PendingPodcastCount + PendingBooksCount + pendingLinksCount + pendingResourcessCount)
    

    PendingResourcesContainer.setAttribute("data-purecounter-end", TotalPendingRequests)
    PendingResourcesContainer.innerHTML = `<span>${TotalPendingRequests}</span`
}

})