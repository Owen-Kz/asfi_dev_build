const followingAccountsContainer = document.getElementById("FollowingAccounts")

fetch("/directory/userFollows", ()=>{
    method:"GET"
})
.then(res => res.json())
.then(data =>{

    for(i=0; i<5; i++){
followingAccountsContainer.innerHTML += `<account data-index="0" id="li" data-name="" style="opacity:0.6;">
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

</account>

`
}
followingAccountsContainer.innerHTML = ""
 
    if(JSON.parse(data.followingData).length > 0){ 

        JSON.parse(data.followingData).forEach(async (following, index) => {
            const id = index
            const Fullname = `${following[0].first_name} ${following[0].last_name}`
            const Username = `${following[0].username}`
            const ProfileImage = following[0].profile_picture
            const Title = following[0].title
            const account_Type = following[0].acct_type

            let ProfilePicture = `${await fetchProfileImage(ProfileImage)}`

            if(ProfileImage == "avatar.jpg"){
                ProfilePicture = await fetchProfileImage("dummy.jpg")
            }else{
                ProfilePicture = await fetchProfileImage(ProfileImage)
            }
            let titleText 
            let AccountIcon



            // if(ProfileImage == "avatar.jpg" ? ProfilePicture : "aaf" | "tetet" ){
            // ProfilePicture = `https://eu.ui-avatars.com/api/?background=random&amp;name=${Fullname}&amp;font-size=0.6`
            // }else{
            // ProfilePicture = await fetchProfileImage(ProfileImage)
            // }

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

            followingAccountsContainer.innerHTML +=`
            <account data-index="0${id}" id="li" data-name="${Fullname}">
            <div class="AccountLeft">
            <a href="/@${Username}"><div class="image_container bg-purple-gradient"><img src="${ProfilePicture}"></div></a><div class="details">
            <div css="name"><a href="/@${Username}">${Fullname} ${AccountIcon}</a>
            </div>
            <div css="degree">${titleText}</div></div>
            </div> 
            </account>`
        });
    }else{
        followingAccountsContainer.innerHTML=`<div class="no_content_message" style='width:70%'>
        <svg class="icon icon-no_sim"><use xlink:href="#icon-no_sim"></use>
      
          <symbol id="icon-no_sim" viewBox="0 0 24 24">
              <path d="M3.656 3.891l17.484 17.438-1.313 1.313-1.875-1.922q-0.563 0.281-0.938 0.281h-10.031q-0.797 0-1.383-0.609t-0.586-1.406v-11.203l-2.625-2.625zM18.984 5.016v11.672l-11.344-11.344 2.344-2.344h7.031q0.797 0 1.383 0.609t0.586 1.406z"></path>
      </symbol>
  </svg>              
          <span class="text">You do not follow any accounts yet</span>
      </div>`
    }
})

