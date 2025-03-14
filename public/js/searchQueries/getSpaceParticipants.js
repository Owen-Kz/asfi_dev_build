const participantsContainer = document.getElementById("active_conversations")
const mobileParticipantsContainer = document.getElementById("active_conversation")
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


    participantsContainer.innerHTML += `
     <li>
          <a href="/@${user_name}" class="px-4 py-3 bg-hover-light-black d-flex align-items-start justify-content-between chat-user">
            <div class="d-flex align-items-center">
              <span class="position-relative rounded-circle" style="height: 45px;">
                <img src="${ProfileImageSrc}" alt="user-profile" width="48" height="48" />
              </span>
              <div class="ms-3 d-inline-block w-75">
                <h6 class="mb-1 fw-semibold chat-title" data-username="${Fullname}">
                 ${Fullname}
                </h6>
                <span class="fs-3 text-truncate text-dark d-block">${TitleMain}</span>
              </div>
            </div>
            <p class="fs-2 mb-0 text-muted"></p>
          </a>
        </li>
`; 
        if(mobileParticipantsContainer){
            mobileParticipantsContainer.innerHTML += `<li>
          <a href="/@${user_name}" class="px-4 py-3 bg-hover-light-black d-flex align-items-start justify-content-between chat-user">
            <div class="d-flex align-items-center">
              <span class="position-relative rounded-circle">
                <img src="${ProfileImageSrc}" alt="user-profile" width="48" height="48" />
              </span>
              <div class="ms-3 d-inline-block w-75">
                <h6 class="mb-1 fw-semibold chat-title" data-username="${Fullname}">
                 ${Fullname}
                </h6>
                <span class="fs-3 text-truncate text-dark d-block">${TitleMain}</span>
              </div>
            </div>
            <p class="fs-2 mb-0 text-muted"></p>
          </a>
        </li>`
        }
    });
    
}else{
    participantsContainer.innerHTML = ""
}
})
}

// Exit a space
const ExistSpace = document.getElementById("ExistSpace")

if(ExistSpace){
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
}

