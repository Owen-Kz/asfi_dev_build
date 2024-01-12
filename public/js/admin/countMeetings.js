// GET The Total Number of channels 
const TotalChannelsContainer = document.getElementById("TotalChannelsContainer")

function CountMeetings(){
    fetch(`https://asfischolar.com/admin/meetings/list/total`, {
        method:"GET"
    }).then(res => res.json())
    .then( data => {
        if(data){
            const TotalChannels = data.TotalChannels  
            TotalChannelsContainer.innerHTML = `<span>${TotalChannels}</span>`
        }
    })
    }
    
    
    CountMeetings()
    