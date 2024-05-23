const participantsContainer = document.getElementById("active_conversations")
const space_participants_header = document.getElementById("space_participants_header")

// get the space participatns only when the container is clicked 
// space_participants_header.addEventListener("click", function(){
    UpdateSpaceParticipants()
// })

const ParticipantsCount = document.getElementById("c-number")

ParticipantsCount.setAttribute("style", "display:none;")


// The funciton for listing all the space participants 
function UpdateSpaceParticipants(){
fetch(`/getSpaceParticipants/${SpaceId}`, ()=>{
    method:"GET"
}).then(res => res.json())
.then(data =>{
participantsContainer.innerHTML = ""
const PArticipants = JSON.parse(data.ParticipantsUserData)
ParticipantsCount.innerText = PArticipants.length

const active_conversations = document.getElementById("active_conversations")

if(PArticipants.length > 0){
    // active_conversations.classList += "active"
    ParticipantsCount.removeAttribute("style", "display:none")
    PArticipants.forEach( async (participant) => {
        const user_name = participant[0].username
        const Fullname = participant[0].first_name +" "+ participant[0].last_name
        const ProfilePicture = participant[0].profile_picture
        const Title = participant[0].title
        const account_Type = participant[0].acct_type 

        let TitleMain 
        if(Title != "N/A" && Title != ""){
            TitleMain = Title
        }else{
            TitleMain = ""
        }

        let ProfileImageSrc
        let AccountIcon

        if(account_Type == "scholar_account"){
            AccountIcon =  `<i class="fas fa-check-circle text-warning me-2"></i>`
        }else if(account_Type == "instructor_account"){
            AccountIcon = `<i class="fas fa-check-circle text-instagram-gradient me-2"></i>`
        }

        if(ProfilePicture == "avatar.jpg"){
            ProfileImageSrc = `https://eu.ui-avatars.com/api/?background=random&name=${Fullname}&font-size=0.5&rounded=true&size=128&background=333333&color=ffffff`
        }else{
            ProfileImageSrc =  await fetchProfileImage(ProfilePicture)
        }


    participantsContainer.innerHTML += `<li class="chat-list-item active">
    <a href="/@${user_name}"> 
      <img src=${ProfileImageSrc} alt="ProfileImage"/>
      </a>
          <a href="/@${user_name}/chat"><div class='recent_chat_content'>
          <span class="chat-list-name">${Fullname} </span>${AccountIcon}
          <br>
          <span class="new_message_content"> 
          ${TitleMain}
          </span>
          </div>
          </a>
          </li>`;
        
    });
    
}else{
    participantsContainer.innerHTML = ""
}
})
}

// Exit a space
const ExistSpace = document.getElementById("ExistSpace")

ExistSpace.addEventListener("click", function(){
    fetch(`/exitSpace/${SpaceId}`, ()=>{
        methof:"GET"
    }).then(res => res.json())
    .then(data =>{
        alert(data.message)
        if(data.message == "You left this space"){
        window.location.href = "/directory"
        }else{
        
        }
        // socket.emit("exited-group", UpdateSpaceParticipants())
    })
})





