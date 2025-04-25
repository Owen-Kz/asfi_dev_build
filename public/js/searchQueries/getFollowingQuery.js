const followingAccountsContainer = document.getElementById("FollowingAccounts")
const footerContainerFollowing = document.getElementById("footerContainerFollowing")


// const SearchBar = document.getElementById("searchDirectory")
// SearchBar.addEventListener("keyup", function(){
//     if(SearchBar.value ==""){
//    FindFollowingAccounts(1)
//     }
// })

function FindFollowingAccounts(page){
fetch(`/directory/userFollows/${page}`, ()=>{
    method:"GET"
})
.then(res => res.json())
.then(data =>{
    const totalPagesFollowing = data.totalPagesFollowing
    const currentPageFollowing = data.currentPageFollowing
    const prevPageFollowing = Math.floor(parseInt(currentPageFollowing) - 1)
    const NexxtPageFollowing = Math.floor(parseInt(currentPageFollowing) + 1)


    if(totalPagesFollowing > 0){
        // Update the pagination UI
        if(footerContainerFollowing){
       const paginationHTMLFollowing = PaginationFollowing(currentPageFollowing, totalPagesFollowing, prevPageFollowing, NexxtPageFollowing);
       footerContainerFollowing.innerHTML = paginationHTMLFollowing;
        }
    }

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


function PaginationFollowing(currentPageFollowing, totalPagesFollowing, prevPageFollowing, NexxtPageFollowing){
    const pageCountContainerFollowing = document.getElementById("pageCountContainerFollowing")
  
if(pageCountContainerFollowing){
       
        pageCountContainerFollowing.innerHTML = ` <p class="mb-0 text-center text-sm-start">Page ${currentPageFollowing} of ${totalPagesFollowing}</p>`;

        let paginationHTMLFollowing = `
        <nav class="mt-4 d-flex justify-content-center" aria-label="navigation">
        <ul class="pagination pagination-primary-soft d-inline-block d-md-flex rounded mb-0">

        <!-- Pagination -->
        <nav class="d-flex justify-content-center mb-0" aria-label="navigation">
        <ul class="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0" id="footer_list">`;
      
        if (currentPageFollowing > 1) {
            paginationHTMLFollowing +=  `<li class="page-item mb-0">
            <a class="page-link" onClick="FindFollowingAccounts(${prevPageFollowing})" tabindex="-1" id="prevTutorialPage">
              <i class="fas fa-angle-double-left"></i>
            </a>
          </li>`
        }
        if(totalPagesFollowing > 10){
          let SortNextFollowing = Math.floor(new Number(currentPageFollowing) + 8)

          for (let i = 1; i <= 8; i++) {
          if (i === currentPageFollowing) {
            paginationHTMLFollowing += `<li class="page-item mb-0 active"><a class="page-link" href="#"> ${i} </a></li>`;
          } else {
            paginationHTMLFollowing += `<li class="page-item mb-0"><a class="page-link" onClick="FindFollowingAccounts(${i})">  ${i}  </a></li>`;
          }
        }
        paginationHTMLFollowing += `<li class="page-item mb-0"><a class="page-link" onClick="FindDiscoverAccounts(${SortNextFollowing})">....</a></li>`;
      }else{
        for (let i = 1; i <= totalPagesFollowing; i++) {
          if (i === currentPageFollowing) {
            paginationHTMLFollowing += `<li class="page-item mb-0 active"><a class="page-link" href="#"> ${i} </a></li>`;
          } else {
            paginationHTMLFollowing += `<li class="page-item mb-0"><a class="page-link" onClick="FindFollowingAccounts(${i})">  ${i}  </a></li>`;
          }
        }
      }
      
        if (currentPageFollowing < totalPagesFollowing) {
          paginationHTMLFollowing += `<li class="page-item mb-0"><a class="page-link" onClick="FindFollowingAccounts(${NexxtPageFollowing})"><i class="fas fa-angle-right"></i></a></li>`;
        } else {
          // paginationHTMLFollowing += `<li class="page-item mb-0 disabled"><span class="page-link"><i class="fas fa-angle-right"></i></span></li>`;
        }

        // if(totalPagesFollowing > 10){
        //   for (let i = 1; i <= 8; i++) {
        //     let SortNextFollowing = Math.floor(new Number(currentPageFollowing) + 8)

      
        //   }
        // }

        paginationHTMLFollowing += `</ul>
        </nav>
       `;
      
        return paginationHTMLFollowing;
}
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
            const prefixMainDisc = following[0].prefix
            
            let prefix
            let ProfilePicture
            
            if(prefixMainDisc === "null" || prefixMainDisc == null){
              prefix = ""
            }else{
              prefix = prefixMainDisc
            }

            if(ProfileImage == "avatar.jpg"){
                ProfilePicture = "https://res.cloudinary.com/dll8awuig/image/upload/v1705444097/dc69h8mggh01bvlvbowh.jpg"
            }else{
                ProfilePicture = ProfileImage
            }
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
            }else if(account_Type == "administrator"){
                AccountIcon = `<i class="fas fa-check-circle text-instagram-gradient me-2"></i>`
            }

            followingAccountsContainer.innerHTML +=`
            <account data-index="0${id}" id="li" data-name="${Fullname}">
            <div class="AccountLeft">
            <a href="/@${Username}"><div class="image_container bg-purple-gradient"><img src="${ProfilePicture}"></div></a><div class="details">
            <div css="name"><a href="/@${Username}">${prefix} ${Fullname} ${AccountIcon}</a>
            </div>
            <div css="degree">${titleText}</div></div>
            </div> 
            <div class="followButton">
            <button class="UnfollowButton" value="${Username}">Unfollow</button>
            </div>
            </account>`
     
    })
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
}

FindFollowingAccounts(1)

