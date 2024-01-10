const discoverAccountsContainer = document.getElementById("DiscoverAccounts")
const loggedUser = document.getElementById("loggedUser")
const footerContainer = document.getElementById("footerContainer")



const SearchBar = document.getElementById("searchDirectory")
SearchBar.addEventListener("keyup", function(){
    if(SearchBar.value ==""){
   FindDiscoverAccounts(1)
    }
})

function FindDiscoverAccounts(page){
    fetch(`/directorydiscoverAccounts?page=${page}`, ()=>{
        method:"GET"
    })
    .then(res => res.json())
    .then(data =>{
        // const TutorialsArray = JSON.parse(data.AllTutorials)
        const TotalPages = data.totalPages
        const CurrentPage = data.currentPage
        const PrevPage = Math.floor(parseInt(CurrentPage) - 1)
        const NexxtPage = Math.floor(parseInt(CurrentPage) + 1)

        DiscoverItems(data)

        if(TotalPages > 0){
            // Update the pagination UI
            if(footerContainer){
           const paginationHTML = Pagination(CurrentPage, TotalPages, PrevPage, NexxtPage);
           footerContainer.innerHTML = paginationHTML;
            }
        }
    })    
}


function Pagination(currentPage, totalPages, PrevPage, NexxtPage){
    const pageCountContainer = document.getElementById("pageCountContainer")
  
if(pageCountContainer){
       
        pageCountContainer.innerHTML = ` <p class="mb-0 text-center text-sm-start">Page ${currentPage} of ${totalPages}</p>`;

        let paginationHTML = `
        <nav class="mt-4 d-flex justify-content-center" aria-label="navigation">
        <ul class="pagination pagination-primary-soft d-inline-block d-md-flex rounded mb-0">

        <!-- Pagination -->
        <nav class="d-flex justify-content-center mb-0" aria-label="navigation">
        <ul class="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0" id="footer_list">`;
      
        if (currentPage > 1) {
            paginationHTML +=  `<li class="page-item mb-0">
            <a class="page-link" onClick="FindDiscoverAccounts(${PrevPage})" tabindex="-1" id="prevTutorialPage">
              <i class="fas fa-angle-double-left"></i>
            </a>
          </li>`
        }
      if(totalPages > 10){
        let SortNext = Math.floor(new Number(currentPage) + 8)

        for (let i = 1; i <= 8; i++) {
          if (i === currentPage) {
            paginationHTML += `<li class="page-item mb-0 active"><a class="page-link" href="#"> ${i} </a></li>`;
          } else {
            paginationHTML += `<li class="page-item mb-0"><a class="page-link" onClick="FindDiscoverAccounts(${i})">  ${i}  </a></li>`;
          }
        }
           paginationHTML += `<li class="page-item mb-0"><a class="page-link" onClick="FindDiscoverAccounts(${SortNext})">... </a></li>`;
      }else{
        for (let i = 1; i <= totalPages; i++) {
          if (i === currentPage) {
            paginationHTML += `<li class="page-item mb-0 active"><a class="page-link" href="#"> ${i} </a></li>`;
          } else {
            paginationHTML += `<li class="page-item mb-0"><a class="page-link" onClick="FindDiscoverAccounts(${i})">  ${i}  </a></li>`;
          }
        }
      }
      
        if (currentPage < totalPages) {
          paginationHTML += `<li class="page-item mb-0"><a class="page-link" onClick="FindDiscoverAccounts(${NexxtPage})"><i class="fas fa-angle-right"></i></a></li>`;
        } else {
          // paginationHTML += `<li class="page-item mb-0 disabled"><span class="page-link"><i class="fas fa-angle-right"></i></span></li>`;
        }
      
        paginationHTML += `</ul>
        </nav>
       `;
      
        return paginationHTML;
}
}

for(i=0; i<10; i++){
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
    const Discover = JSON.parse(data.DiscoverData)

    const sortedDiscover = [...Discover].sort((a, b) => a.first_name.localeCompare(b.first_name));
    discoverAccountsContainer.innerHTML = ""

        if (sortedDiscover.length > 0) {
            for(i =0; i < sortedDiscover.length; i++){
               
         
            const id = i
            const Fullname = `${sortedDiscover[i].first_name} ${sortedDiscover[i].last_name}`
            const Username = `${sortedDiscover[i].username}`
            const ProfileImage = `${sortedDiscover[i].profile_picture}`
            const Title = `${sortedDiscover[i].title}`
            const account_Type = `${sortedDiscover[i].acct_type}`

            let profileimageMain
            if(ProfileImage == "avatar.jpg"){
                profileimageMain = "dummy.jpg"
            }else{
                profileimageMain = ProfileImage
            }


            await fetch(`/files/uploaded/images/${profileimageMain}`, ()=>{
                method:"GET"
            })
            .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.blob(); // Get the response as a Blob
              })
              .then(async blob => {
                // Create a URL for the Blob object
                const fileURL = URL.createObjectURL(blob);
                const ProfilePicture = fileURL

            let titleText
            let FollowingStatus

            await fetch(`/check/validate/follower/${Username}`, ()=>{
                method:"GET"
            }).then(res => res.json())
            .then(data =>{
                if(data.message === "following"){
                    FollowingStatus = `<button> Following </button>`
                }else{
                    FollowingStatus = `<form method="post" class="follow">
                    <input type="hidden" name="followed" id="followed"  value="${Username}" readonly>
                    <input type="hidden" name="follower" id="follower" value="${loggedUser.value}" readonly>
                    <button class="discoverFollowButton" value="${Username}">Follow</button>
        
                </form> `
                }
            })

            if(Title == "N/A"){
                titleText = "" 
            }else{
                titleText = Title
            }
            let AccountIcon = `${account_Type  == "scholar_account" ? '<i class="fas fa-check-circle text-warning me-2"></i>' : '<i class="fas fa-check-circle text-instagram-gradient me-2"></i>'}`
            // data-index="${index}" id="li" data-name="${Fullname}"
        
            discoverAccountsContainer.innerHTML +=`
            <account data-index="${id}">
            <div class="AccountLeft">
            <a href="/@${Username}">
            <div class="image_container bg-purple-gradient">
          <img src= ${ProfilePicture} />
            </div></a> 
            <div class="details">
            <div css="name"><a href="/@${Username}">${Fullname} ${AccountIcon}</a>
            </div>
            <div class="degree">${titleText}</div></div>
            </div>

            <div class="followButton">
            ${FollowingStatus}
            </div>
            </account>`;
            
        });
    }

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




FindDiscoverAccounts(1)
