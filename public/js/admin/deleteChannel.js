function DeleteChannel(channelSecret){
    fetch(`https://asfischolar.com/admin/meetings/delete?channel=${channelSecret}`, {
        method: "GET"
    }).then(res => res.json())
    .then(data =>{
        if(data.message === "channelDeleted"){
            alert("Channel Deleted Successfully")
            NewMeetingPage(1)
        }
    })
}  