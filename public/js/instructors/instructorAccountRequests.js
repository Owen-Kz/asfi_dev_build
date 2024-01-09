const ListContainer = document.getElementById("listContainer")
const footerContainer = document.getElementById("footer_container")


function renderResources(data, ForQuery){
    
    const InstructorList = JSON.parse(data.InstructorRequestList)
    if(InstructorList.length > 0){
        ListContainer.innerHTML = ``
        
        InstructorList.forEach(person => {
            const account_status = person.account_status
            const acct_type = person.acct_type
            const username = person.username
            const fullname = `${person.first_name} ${person.last_name}`
            const Email = person.email
            const profile_picture = person.profile_picture
            const Bio = person.bio
            let Action
            let displayPhoto

            if(profile_picture == "avatar.jpg"){
                displayPhoto = `https://eu.ui-avatars.com/api/?background=random&amp;name=${fullname}&amp;font-size=0.6`
            }else{
                displayPhoto =  `https://asfi-demo-app-2cbea9ef1c2f.herokuapp.com/userUploads/profileImages/${profile_picture}`
            }

            if(account_status == "3"){
                Action = `<a href="#" class="btn btn-success me-1 mb-1 mb-md-0 disabled">Accepted</a>
                <a href="#" class="btn btn-primary-soft me-1 mb-0" data-bs-toggle="modal" data-bs-target="#appDetail" onClick="ViewApplication('${username}')">View App</a>`
            }else if(account_status == "0"){
                Action = `	<a href="#" class="btn btn-secondary me-1 mb-1 mb-md-0 disabled">Rejected</a>
                <a href="#" class="btn btn-primary-soft me-1 mb-0" data-bs-toggle="modal" data-bs-target="#appDetail" onClick="ViewApplication('${username}')">View App</a>`
            }else if(account_status == "2"){
                Action = ` <a href="#" class="btn btn-success-soft me-1 mb-1 mb-lg-0" onClick="AcceptApplication('${username}')">Accept</a>
                <a href="#" class="btn btn-secondary-soft me-1 mb-1 mb-lg-0" onClick="RejectApplication('${username}')">Reject</a>
                <a href="#" class="btn btn-primary-soft me-1 mb-0" data-bs-toggle="modal" data-bs-target="#appDetail" onClick="ViewApplication('${username}')">View App</a>`
            }

        ListContainer.innerHTML += `<tr>
        <!-- Table data -->
        <td>
            <div class="d-flex align-items-center position-relative">
                <!-- Image -->
                <div class="avatar avatar-md">
                    <img src="${displayPhoto}" class="rounded-circle" alt="">
                </div>
                <div class="mb-0 ms-2">
                    <!-- Title -->
                    <h6 class="mb-0"><a href="#" class="stretched-link">${fullname}</a></h6>
                </div>
            </div>
        </td>

        <!-- Table data -->
        <td class="text-center text-sm-start">
            <h6 class="mb-0">${Bio}</h6>
        </td>

        <!-- Table data -->
        <td>22 Oct 2023</td>

        <!-- Table data -->
        <td>
           ${Action}
        </td>
    </tr>`
        });
    }
        // Render pagination
    const totalPages = data.totalPages;
    const currentPage = data.currentPage;
    const PrevPage = parseInt(currentPage, 10) - 1;
    const NexxtPage = parseInt(currentPage, 10) + 1;
    
  
    if(ForQuery == "regular"){
        const paginationHTML = generatePaginationHTML(currentPage, totalPages, PrevPage, NexxtPage, ForQuery);
        footerContainer.innerHTML = paginationHTML;
    }else if(ForQuery == "search"){
        const paginationHTML = generateSearchPaginationHTML(currentPage, totalPages, PrevPage, NexxtPage, ForQuery);
        footerContainer.innerHTML = paginationHTML;
    }else if(ForQuery == "filter"){
        const paginationHTML = generateFilterPaginationHTML(currentPage, totalPages, PrevPage, NexxtPage, ForQuery);
        footerContainer.innerHTML = paginationHTML;
    }

}

function NewPage(page){
    ListContainer.innerHTML = "<tr><td>Loading...</td></tr>";

fetch(`/admin/instructors/account/requests?page=${page}`, ()=>{
    method : "GET"
}).then(res =>  res.json())
.then(data =>{
    renderResources(data, "regular")
})
}


NewPage(1, "regular")




// VIEW APPLICATION 
const applicationBody = document.getElementById("applicationBody")
function ViewApplication(username){
    applicationBody.innerHTML = ""

    fetch(`/users/${username}`, ()=>{
        method: "GET"
    }).then(res => res.json())
    .then(data =>{
        const ReviewerData = JSON.parse(data.UserInfo)
        const ReviewerProfilePicture = ReviewerData[0].profile_picture
        const Bio = ReviewerData[0].bio
        const Prefix = ReviewerData[0].prefix
        const email = ReviewerData[0].email
        const Phonenumber = ReviewerData[0].phonenumber
        const Fullname= `${ReviewerData[0].first_name} ${ReviewerData[0].last_name}`

        if(ReviewerProfilePicture == "avatar.jpg"){
            ProfileSource = `https://eu.ui-avatars.com/api/?background=random&amp;name=${Fullname}&amp;font-size=0.6`
        }else{
            ProfileSource = `https://asfi-demo-app-2cbea9ef1c2f.herokuapp.com/userUploads/profileImages/${ReviewerProfilePicture}`
        }
        applicationBody.innerHTML = `		<span class="small">Applicant Name:</span>
        <h6 class="mb-3">${Fullname}</h6>

        <!-- Email -->
        <span class="small">Applicant Email id:</span>
        <h6 class="mb-3">${email}</h6>

        <!-- Phone number -->
        <span class="small">Applicant Phone number:</span>
        <h6 class="mb-3">${Phonenumber}</h6>

        <!-- Summary -->
        <span class="small">Bio:</span>
        <p class="text-dark mb-2">${Bio}</p>

    `
    })
}

// Accept Request 
function AcceptApplication(username){
    const data = {
        username: username
    }
    fetch(`/instructors/applications/accept/${username}`, {
        method:"POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type" : "application/JSON"
        }
    }).then(res => res.json())
    .then(data =>{
        if(data.status === "success"){
            alert(data.message)
            window.location.reload()
        }else{
            alert(data.message)
        }
    })
}


// Reject Application 
function RejectApplication(username){
    const data = {
        username: username
    }
   
    fetch(`/instructors/applications/reject/${username}`, {
        method:"POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type" : "application/JSON"
        }
    }).then(res => res.json())
    .then(data =>{
        if(data.status === "success"){
            alert(data.message)
            window.location.reload()
        }else{
            alert(data.message)
        }
    })
}



// Pagination
function generatePaginationHTML(currentPage, totalPages, PrevPage, NexxtPage) {
    let paginationHTML = `
        <div class="d-sm-flex justify-content-sm-between align-items-sm-center mt-4 mt-sm-3">
            <p class="mb-0 text-center text-sm-start">Page ${currentPage} of ${totalPages}</p>
            <nav class="d-flex justify-content-center mb-0" aria-label="navigation">
                <ul class="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0" id="footer_list">`;

    if (currentPage > 1) {
        paginationHTML += `<li class="page-item mb-0"><a class="page-link" onClick="NewPage(${PrevPage}, 'regular')" tabindex="-1"><i class="fas fa-angle-left"></i></a></li>`;
    }

    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<li class="page-item mb-0 active"><a class="page-link" href="#"> ${i} </a></li>`;
        } else {
            paginationHTML += `<li class="page-item mb-0"><a class="page-link" onClick="NewPage(${i}, 'regular')">  ${i}  </a></li>`;
        }
    }

    if (currentPage < totalPages) {
        paginationHTML += `<li class="page-item mb-0"><a class="page-link" onClick="NewPage(${NexxtPage}, 'regular')"><i class="fas fa-angle-right"></i></a></li>`;
    } else if(currentPage > totalPages) {
        paginationHTML += `<li class="page-item mb-0 disabled"><span class="page-link"><i class="fas fa-angle-right"></i></span></li>`;
    }

    paginationHTML += `</ul>
    </nav>
    </div>`;

    return paginationHTML;
}

function generateSearchPaginationHTML(currentPage, totalPages, PrevPage, NexxtPage, ForQuery) {
    let paginationHTML = `
        <div class="d-sm-flex justify-content-sm-between align-items-sm-center mt-4 mt-sm-3">
            <p class="mb-0 text-center text-sm-start">Page ${currentPage} of ${totalPages}</p>
            <nav class="d-flex justify-content-center mb-0" aria-label="navigation">
                <ul class="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0" id="footer_list">`;

    if (currentPage > 1) {
        paginationHTML += `<li class="page-item mb-0"><a class="page-link" onClick="NewSearchPage(${PrevPage}, 'search')" tabindex="-1"><i class="fas fa-angle-left"></i></a></li>`;
    }

    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<li class="page-item mb-0 active"><a class="page-link" href="#"> ${i} </a></li>`;
        } else {
            paginationHTML += `<li class="page-item mb-0"><a class="page-link" onClick="NewSearchPage(${i}, 'search')">  ${i}  </a></li>`;
        }
    }

    if (currentPage < totalPages) {
        paginationHTML += `<li class="page-item mb-0"><a class="page-link" onClick="NewSearchPage(${NexxtPage}, 'search')"><i class="fas fa-angle-right"></i></a></li>`;
    } else if(currentPage > totalPages) {
        paginationHTML += `<li class="page-item mb-0 disabled"><span class="page-link"><i class="fas fa-angle-right"></i></span></li>`;
    }

    paginationHTML += `</ul>
    </nav>
    </div>`;

    return paginationHTML;
}

function generateFilterPaginationHTML(currentPage, totalPages, PrevPage, NexxtPage, ForQuery) {
    let paginationHTML = `
        <div class="d-sm-flex justify-content-sm-between align-items-sm-center mt-4 mt-sm-3">
            <p class="mb-0 text-center text-sm-start">Page ${currentPage} of ${totalPages}</p>
            <nav class="d-flex justify-content-center mb-0" aria-label="navigation">
                <ul class="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0" id="footer_list">`;

    if (currentPage > 1) {
        paginationHTML += `<li class="page-item mb-0"><a class="page-link" onClick="NewFilterPage(${PrevPage}, 'filter')" tabindex="-1"><i class="fas fa-angle-left"></i></a></li>`;
    }

    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<li class="page-item mb-0 active"><a class="page-link" href="#"> ${i} </a></li>`;
        } else {
            paginationHTML += `<li class="page-item mb-0"><a class="page-link" onClick="NewFilterPage(${i}, 'filter')">  ${i}  </a></li>`;
        }
    }

    if (currentPage < totalPages) {
        paginationHTML += `<li class="page-item mb-0"><a class="page-link" onClick="NewFilterPage(${NexxtPage}, 'filter')"><i class="fas fa-angle-right"></i></a></li>`;
    } else if(currentPage > totalPages) {
        paginationHTML += `<li class="page-item mb-0 disabled"><span class="page-link"><i class="fas fa-angle-right"></i></span></li>`;
    }

    paginationHTML += `</ul>
    </nav>
    </div>`;

    return paginationHTML;
}


// Search For instructors 
// Search for Courses 
const searchResources = document.getElementById("searchResources")
const searchForResources = document.getElementById("searchForResources")

if(searchResources){

searchResources.addEventListener("submit", function(e){
    e.preventDefault();
    
    if(searchForResources.value == "" || !searchForResources.value){
        NewPage(1, "regular")
    }else{
        NewSearchPage(1)
}
})
function NewSearchPage(page){
    fetch(`/admin/instructors/account/requests?q=${searchForResources.value}&page=${page}`, ()=>{
        method : "GET"
    }).then(res => res.json())
    .then(data =>{
        // console.log(data)
        renderResources(data, "search")
    })
 }
}


// Filter By CAtegory 
const filterByType = document.getElementById("filterByType")
const submitFilter = document.getElementById("submitFilter")
const filterType = document.getElementById("filterType")

filterType.addEventListener("change", function(){
    if(filterType.value !== "" && filterType.value !== "all"){
        submitFilter.click()
    }else{
        NewPage(1, "regular")
    }
})

filterByType.addEventListener("submit", function(e){
    e.preventDefault()
    NewFilterPage(1)
})

function NewFilterPage(page){
    fetch(`/admin/instructors/account/requests?filter=${filterType.value}&page=${page}`, ()=>{
        method : "GET"
    }).then(res => res.json())
    .then(data =>{
        // console.log(data)
        renderResources(data, "filter")
    })
}
