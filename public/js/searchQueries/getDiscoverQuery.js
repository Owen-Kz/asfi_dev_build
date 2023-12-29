const discoverAccountsContainer = document.getElementById("DiscoverAccounts")
const loggedUser = document.getElementById("loggedUser")

const SearchBar = document.getElementById("searchDirectory")
SearchBar.addEventListener("keyup", function(){
    if(SearchBar.value ==""){
        fetch("/directorydiscoverAccounts", ()=>{
            method:"GET"
        })
        .then(res => res.json())
        .then(data =>{
            DiscoverItems(data)
        })
    }
})

fetch("/directorydiscoverAccounts", ()=>{
    method:"GET"
})
.then(res => res.json())
.then(data =>{
    DiscoverItems(data)
})


for(i=0; i<5; i++){
discoverAccountsContainer.innerHTML += `
<account data-index="0" id="li" data-name="" style="opacity:0.6;">
<div class="AccountLeft">
<a href="#">
<div class="image_container"  style="background-color:grey;">
<img src=""></div></a>
<div class="details">
<div css="name"  style="width:150px; height:20px; background-color:grey">
</div>
<div css="degree"  style="width:80px; height:20px; background-color:grey"></div>
</div>
</div>
<div class="followButton"  style="height:20px; background-color:grey">
</div>
</account>

`
}

async function DiscoverItems(data){
    discoverAccountsContainer.innerHTML = ""
    if(data.DiscoverData.length > 0){

        data.DiscoverData.forEach(discover => {
            const id = discover.ID
            const Fullname = `${discover.first_name} ${discover.last_name}`
            const Username = `${discover.username}`
            const ProfileImage = discover.profile_picture
            const Title = discover.title
            const account_Type = discover.acct_type

            let titleText 
            let AccountIcon
        
        if(Title == "N/A"){
            titleText = ""
        }else{
            titleText = Title
        }

        if(account_Type == "scholar_account"){
            AccountIcon =  `<i class="fas fa-check-circle text-warning me-2"></i>`
        }else if(account_Type == "instructor_account"){
            AccountIcon = `<i class="fas fa-check-circle text-instagram-gradient me-2"></i>`
        }

        if(ProfileImage == "avatar.jpg"){
            const ProfilePicture = `https://eu.ui-avatars.com/api/?background=random&amp;name=${Fullname}&amp;font-size=0.6`
       
            discoverAccountsContainer.innerHTML +=`
            <account data-index="0${id}" id="li" data-name="${Fullname}">
            <div class="AccountLeft">
            <a href="/@${Username}">
            <div class="image_container bg-purple-gradient">
            <img src="${ProfilePicture}"></div></a>
            <div class="details">
            <div css="name"><a href="/@${Username}">${Fullname} ${AccountIcon}</a>
            </div>
            <div css="degree">${titleText}</div></div>
            </div>
            <div class="followButton">

            <form method="post" class="follow">
            <input type="hidden" name="followed" id="followed"  value="${Username}" readonly>
            <input type="hidden" name="follower" id="follower" value="${loggedUser.value}" readonly>
            <button class="discoverFollowButton" value="${Username}">Follow</button>

        </form> 
   

            </div>
            
            </account>`

            


            }else{ 
                fetch(`/files/uploaded/images/${ProfileImage}`, ()=>{
                    method:"GET"
                })
                .then(response => {
                    if (!response.ok) {
                      throw new Error('Network response was not ok');
                    }
                    return response.blob(); // Get the response as a Blob
                  })
                  .then(blob => {
                    // Create a URL for the Blob object
                    const fileURL = URL.createObjectURL(blob);
                    const ProfilePicture = fileURL
                    
                    discoverAccountsContainer.innerHTML +=`
                    <account data-index="0${id}" id="li" data-name="${Fullname}">
                    <div class="AccountLeft">
                    <a href="/@${Username}">
                    <div class="image_container bg-purple-gradient">
                    <img src="${ProfilePicture}"></div></a>
                    <div class="details">
                    <div css="name"><a href="/@${Username}">${Fullname} ${AccountIcon}</a>
                    </div>
                    <div class="degree">${titleText}</div></div>
                    </div>

                    <div class="followButton">

                    <form method="post" class="follow">
                    <input type="hidden" name="followed" id="followed"  value="${Username}" readonly>
                    <input type="hidden" name="follower" id="follower" value="${loggedUser.value}" readonly>
                    <button class="discoverFollowButton" value="${Username}">Follow</button>
        
                </form> 
           
        
                    </div>
                    </account>`
                    // Use the fileURL to display the PDF in an iframe or link to download
                })
                .catch(error => {
                  console.error('There was a problem fetching the image:', error);
                  // Handle errors, display a message, etc.
                });
          
            }

        

           
        });

    }else{
        discoverAccountsContainer.innerHTML = `<div class="no_content_message" style='width:70%'>
        <svg class="icon icon-no_sim"><use xlink:href="#icon-no_sim"></use>
      
          <symbol id="icon-no_sim" viewBox="0 0 24 24">
              <path d="M3.656 3.891l17.484 17.438-1.313 1.313-1.875-1.922q-0.563 0.281-0.938 0.281h-10.031q-0.797 0-1.383-0.609t-0.586-1.406v-11.203l-2.625-2.625zM18.984 5.016v11.672l-11.344-11.344 2.344-2.344h7.031q0.797 0 1.383 0.609t0.586 1.406z"></path>
      </symbol>
  </svg>              
          <span class="text">Become our First Scholar</span>
      </div>`
    }
}




