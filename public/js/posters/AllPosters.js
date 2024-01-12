const posterContainer = document.getElementById("posterContainer")
const TotalPostersContainer = document.getElementById("TotalPostersContainer")
const footerContainer = document.getElementById("footer_container")
const searchQuery = document.getElementById("searchField")
const SearchForm = document.getElementById("searchForm")


SearchForm.addEventListener("submit", function(e){
    e.preventDefault()
    if(searchQuery.value != ""){
        SearchForposter(searchQuery.value, 1)
    }else{
        NewposterPage(1)
    }
}) 

searchQuery.addEventListener("change", function(){
    if(searchQuery.value == ""){
        NewposterPage(1)
    }
})
 


function NewposterPage(page){
    posterContainer.innerHTML  = "Loading...."
  
    fetch(`https://asfischolar.com/admin/posters/list?page=${page}`, {
        method: "GET"
    }).then(res => res.json())
    .then(data => { 
  
        if(data){           
          
            updateUi(data)
        }
    })
}

NewposterPage(1)


// Search for posters 
function SearchForposter(value, page){
    fetch(`https://asfischolar.com/admin/posters/list?page=${page}&q=${value}`, {
        method:"GET"
    }).then(res => res.json())
    .then(data =>{
        if(data){
            updateUi(data)
        }
    })
}



// GET The Total Number of Posters 
function Countposters(){
fetch(`https://asfischolar.com/admin/posters/list/total`, {
    method:"GET"
}).then(res => res.json())
.then( data => {
    if(data){
        const TotalPosters = data.TotalPosters  
        TotalPostersContainer.innerHTML = `<span>${TotalPosters}</span>`
    }
})
}

Countposters()

 
async function updateUi(data){
    posterContainer.innerHTML = ""
         const postersList = JSON.parse(data.PosterList)
            const currentPage = data.currentPage
            const totalPages = data.totalPages
            const PrevPage = parseInt(currentPage, 10) - 1;
            const NexxtPage = parseInt(currentPage, 10) + 1;
        
            if(postersList.length > 0){
                postersList.forEach(async poster => {
                    const posterTitle = poster.poster_deck_title
                    const Owner = poster.poster_deck_owner
                    const meeting = poster.poster_deck_meeting
                    const presenterEmail = poster.presenter_email 
                    const Postersecret = poster.poster_deck_id
                    const meetingName = await GetMeetingName(meeting)


                  

                    posterContainer.innerHTML += `		   <tr>
                    <!-- Course item -->
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="mb-0 ms-2">
                                <!-- Title -->
                                <h6><a href="#">${posterTitle}</a></h6>
    
                            </div>
                        </div>
                    </td>
                    <td>
                        <!-- Info -->
                        <div class="bg-opacity-10">
                        ${Owner}</a>
                        </div>
                </td>


                    <!-- Assset Type -->
                    <td>
                        ${meetingName}</a>
                    </td>
                    <td>
                    ${presenterEmail}
                    </td>
            
                    <!-- Action item -->
                    <td class="action-table">
                    <a href="https://asfischolar.com/event/poster/${Postersecret}" type="button" class="btn btn-sm btn-success-soft me-1 mb-1 mb-md-0" target=_blank>View</a>
                        <button type="button" class="btn btn-sm btn-danger-soft me-1 mb-1 mb-md-0" onclick=DeletePoster('${Postersecret}')>Delete</button>
              
                    </td>

                </tr>`
                });

                const paginationHTML = generatePaginationHTML(currentPage, totalPages, PrevPage, NexxtPage);
                footerContainer.innerHTML = paginationHTML;        
            }else{
                posterContainer.innerHTML = "Nothing to display yet"
}}

async function GetMeetingName(meetingName){
    let Title
    await fetch(`https://asfischolar.com/admin/meeting?name=${meetingName}`, {
        method :"GET"
    }).then(res => res.json())
    .then(data =>{
        const meetingNameReturned = JSON.parse(data.MeetingTitle)
        Title =  meetingNameReturned[0].title
    })
    return Title
}
// PAGINATION SCRIPT 
function generatePaginationHTML(currentPage, totalPages, PrevPage, NexxtPage) {
    let paginationHTML = `
        <div class="d-sm-flex justify-content-sm-between align-items-sm-center mt-4 mt-sm-3">
            <p class="mb-0 text-center text-sm-start">Page ${currentPage} of ${totalPages}</p>
            <nav class="d-flex justify-content-center mb-0" aria-label="navigation">
                <ul class="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0" id="footer_list">`;

    if (currentPage > 1) {
        paginationHTML += `<li class="page-item mb-0"><a class="page-link" onClick="NewposterPage(${PrevPage})" tabindex="-1"><i class="fas fa-angle-left"></i></a></li>`;
    }

    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<li class="page-item mb-0 active"><a class="page-link" href="#"> ${i} </a></li>`;
        } else {
            paginationHTML += `<li class="page-item mb-0"><a class="page-link" onClick="NewposterPage(${i})">  ${i}  </a></li>`;
        }
    }

    if (currentPage < totalPages) {
        paginationHTML += `<li class="page-item mb-0"><a class="page-link" onClick="NewposterPage(${NexxtPage})"><i class="fas fa-angle-right"></i></a></li>`;
    } else if(currentPage > totalPages) {
        paginationHTML += `<li class="page-item mb-0 disabled"><span class="page-link"><i class="fas fa-angle-right"></i></span></li>`;
    }

    paginationHTML += `</ul>
    </nav>
    </div>`;

    return paginationHTML;
}
 
