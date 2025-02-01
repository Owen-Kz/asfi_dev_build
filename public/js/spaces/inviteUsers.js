$(".search-chat").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $(".invite-users li").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});

async function GetFollowing(page){
   return fetch(`/directory/userFollows/${page}`, ()=>{
        method:"GET"
    })
    .then(res => res.json())
    .then(data =>{
  
        return data.followingData
    })
}
let inviteUSERS = []
// async function Pagination(page){
inviteUSERS = await GetFollowing(1);
// }


// Pagination(1)


const usersArray  = JSON.parse(inviteUSERS)

const inviteUsers = document.querySelector("#inviteusers");
function feedData(){
    if(usersArray.length > 0){
    usersArray.forEach((user) => {
      
        inviteUsers.innerHTML += `<li><div class="profile-container">
                        <div class="waiting-img"><img src="/files/images/01.png" alt=""></div>
                        <span class="username">${user[0].first_name} ${user[0].last_name}</span> 
                        </div>
                        
                        <form class="inviteForm">
                        <input name="username" value="${user[0].username}" hidden/>
                        
                        <button type="submit" class="invite">Invite</button>
                        </form>
                    </li>
                    <div class="line"></div>`
                    InviteForms()
    })
}else{
    inviteUsers.innerHTML += `<li>Start Following Users to invite them</li>`
}
}

feedData();

function InviteForms(){
    const inviteForm = document.querySelectorAll(".inviteForm")
  
    inviteForm.forEach(form =>{
        form.addEventListener("submit", (e) =>{
            e.preventDefault()
            const username = form.querySelector("input")
            const data = {
                userEmail:username.value,
                space_id:spaceID.value
            }
        fetch("/inviteToSpace", {
                method:"POST",
                body: JSON.stringify(data),
                headers:{
                  "Content-type" : "application/JSON"
                }
        }).then(res => res.json())
        .then(async data => {
            if(data.success){
                form.innerHTML =  `<button type="button" class="invite" disabled>User invited</button>`
            }else{
                 form.innerHTML =  `<button type="button" class="invite" disabled>${data.error}</button>`
            }
     
        })
        })
    })
    
    }