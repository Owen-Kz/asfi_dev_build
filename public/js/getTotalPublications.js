const totalPublications = document.getElementById("totalPublications")


fetch("/getTotalScholarPublications", ()=>{
    method: "GET"
}).then(res => res.json())
.then(data =>{
    if(data){
        const totalPublictaionsCount = data.totalPublicationsCount
        totalPublications.innerText = totalPublictaionsCount
    }
})