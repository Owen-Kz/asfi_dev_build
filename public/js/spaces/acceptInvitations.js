  
    const spaceID = document.querySelector("#space_id");
    async function getUserData(username){
        return fetch(`/getUserPublicData/${username}`, {
            
        }).then(res =>res.json())
        .then(data =>{
            if(data.success){
                return data.user
            }else{
                return []
            }
        })
    }

const waitingList = document.querySelector("#waitinglist");
    
fetch("/getWaitingList", {
        method:"POST",
        body: JSON.stringify({space_id: spaceID.value}),
        headers:{
          "Content-type" : "application/JSON"
        }
      }).then(res => res.json())
      .then(async data => {
      
       if(data.success){
        const invitedUsers = data.waitingList 
if(invitedUsers.length > 0){
        for(let i=0; i<invitedUsers.length; i++){
            const userData = await getUserData(invitedUsers[i].user)
            let profileImage = "https"

            if(userData.profile_picture !== "avatar.jpg"){
                profileImage = userData.profile_picture
            }
      
            waitingList.innerHTML = `<li><div class="profile-container">
                        <div class="waiting-img"><img src="/files/images/${profileImage}" alt=""></div>
                        <span class="username">${userData.first_name} ${userData.last_name}</span> 
                        </div>
                        <form class="approveForm">
                        <input name="username" value="${userData.username}" hidden/>
                        
                        <button type="submit" class="approve">Approve</button>
                        </form>
                    </li>
                    <div class="line"></div>`;
        }
        ApproveFOrms()
            
        }
       }else{
        waitingList.innerHTML = `<li>No waitin room requests available</li>`
       }
    }
)

function ApproveFOrms(){
const approveForm = document.querySelectorAll(".approveForm")

approveForm.forEach(form =>{
    form.addEventListener("submit", (e) =>{
        e.preventDefault()
        const username = form.querySelector("input")
        const data = {
            requested_by:username.value,
            space_id:spaceID.value
        }
        
        fetch("/approveSpaceRequest", {
            method:"POST",
            body: JSON.stringify(data),
            headers:{
              "Content-type" : "application/JSON"
            }
    }).then(res => res.json())
    .then(async data => {
        
        if(data.success){
            form.innerHTML =  `<button type="button" class="approve" disabled>Request Approved</button>`
        }else{
            form.innerHTML =  `<button type="button" class="approve" disabled>${data.error}</button>`
            
        }
 
    })
    })
})

}