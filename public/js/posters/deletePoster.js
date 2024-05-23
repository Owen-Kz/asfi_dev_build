function DeletePoster(channelSecret){
    fetch(`https://asfischolar.com/admin/poster/delete?posterID=${channelSecret}`, {
        method: "GET"
    }).then(res => res.json())
    .then(data =>{
        if(data.message === "posterDeleted"){
            alert("Poster Deleted Successfully")
            NewposterPage(1)
        }
    })
}  