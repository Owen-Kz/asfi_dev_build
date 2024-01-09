


let TotaluploadedRequests 


const uploadedResourcesContainer = document.getElementById("uploadedTotaluploadedRequests")


// CountPening Books 
fetch(`/admin/dashboard/count/uploaded/resources`, ()=>{
    method : "GET"
}).then(res => res.json())
.then(data =>{
    const Counts = JSON.parse(data.queryArray)
    if(Counts.length > 0){
const uploadedBooksCount = Counts[0]
    const uploadedTutorialsCount   = Counts[1]
    const uploadedPodcastCount = Counts[2]
    const uploadedLinksCount = Counts[3]

    TotaluploadedRequests = Math.floor(uploadedTutorialsCount + uploadedPodcastCount + uploadedBooksCount + uploadedLinksCount)
    

    uploadedResourcesContainer.setAttribute("data-purecounter-end", TotaluploadedRequests)
    uploadedResourcesContainer.innerHTML = `<span>${TotaluploadedRequests}</span`
}

})