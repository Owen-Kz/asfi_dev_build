const searchNameUser = document.getElementById("searchNameUser")
const totalFollowingCount = document.getElementById("totalFollowingCount")

if(totalFollowingCount){
    fetch(`/${searchNameUser.value}/totalfollowing`, ()=> {
        method:"GET"
    }).then(res => res.json())
    .then(data =>{
        totalFollowingCount.innerText = data.TotalFollowers
    })
    }