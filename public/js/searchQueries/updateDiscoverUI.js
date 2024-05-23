// const discoverAccountsContainer = document.getElementById("DiscoverAccounts")
const FollowingSlide = document.getElementById("FollowingSlide")

function updateDiscoverUI(scholarArray){
    discoverAccountsContainer.innerHTML = ""
    FollowingSlide.click()
    if(scholarArray.length > 0){
        scholarArray.forEach(async (discover,index) => {
            const id = discover.ID
            const Fullname = `${discover.first_name} ${discover.last_name}`
            const Username = `${discover.username}`
            const ProfileImage = discover.profile_picture
            const Title = discover.title
            const account_Type = discover.acct_type

            let ProfilePicture 
            

            if(ProfileImage == "avatar.jpg"){
                ProfilePicture = await fetchProfileImage("dummy.jpg")
            }else{
                ProfilePicture = await fetchProfileImage(ProfileImage)
            }

            let titleText
            

            if(Title == "N/A"){
                titleText = ""
            }else{
                titleText = Title
            }
            let AccountIcon = `${account_Type  == "scholar_account" ? '<i class="fas fa-check-circle text-warning me-2"></i>' : '<i class="fas fa-check-circle text-instagram-gradient me-2"></i>'}`
            // data-index="${index}" id="li" data-name="${Fullname}"
            discoverAccountsContainer.innerHTML +=`
            <account data-index="${index}">
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

        });
    }else{
        discoverAccountsContainer.innerHTML = `<div class="no_content_message" style='width:70%'>
        <svg class="icon icon-no_sim"><use xlink:href="#icon-no_sim"></use>
      
          <symbol id="icon-no_sim" viewBox="0 0 24 24">
              <path d="M3.656 3.891l17.484 17.438-1.313 1.313-1.875-1.922q-0.563 0.281-0.938 0.281h-10.031q-0.797 0-1.383-0.609t-0.586-1.406v-11.203l-2.625-2.625zM18.984 5.016v11.672l-11.344-11.344 2.344-2.344h7.031q0.797 0 1.383 0.609t0.586 1.406z"></path>
      </symbol>
  </svg>              
          <span class="text">No data match your search</span>
      </div>`
    }
}