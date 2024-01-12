
// GET RESOURCES 
const userResourceContainer = document.getElementById("userResourceContainer")

const footerContainer = document.getElementById("footer_container")

async function NewPage(page, ForQuery) {
    fetch(`/admin/getAllResources?page=${page}`, ()=>{
        method:"GET"
    }).then(res => res.json())
    .then(data => {

        renderResources(data, ForQuery);
    })

}

function renderResources(data, ForQuery) {
    userResourceContainer.innerHTML = ` `  // Clear previous content
    // if (data) {
        const queryResult = JSON.parse(data.queryArray);
        if(queryResult.length > 0){
        queryResult.forEach(Item => {

            let Action
            let CarryAction
            let TypeText = '';
            if (Item.itemType === "book") {
                TypeText = `<span class="badge bg-primary bg-opacity-10 text-primary">BOOK</span>`;
                Action = `https://asfischolar.org/library/books/${Item.File}`
            } else if (Item.itemType === "link") {
                TypeText = `<span class="badge bg-primary bg-opacity-10 text-primary">PUBLICATION LINK</span>`;
                Action = `${Item.title}`
            } else if (Item.itemType === "podcast") {
                TypeText = `<span class="badge bg-purple bg-opacity-10 text-purple">PODCAST</span>`;
                Action = `https://asfischolar.org/userUploads/Audio/${Item.File}`
            } else if (Item.itemType === "tutorial") {
                TypeText = `<span class="badge bg-warning bg-opacity-10 text-warning">TUTORIAL</span>`;
                Action = `https://asfischolar.org/userUploads/Videos/${Item.File}`
            }

            if(Item.Status == "live"){
                CarryAction = `<a href="${Action}" class="btn btn-primary-soft me-1 mb-0" target=_blank>View</a>

                <form class="rejectionForm">
                <input type="hidden" id="ItemID" value="${Item.itemID}" readonly/>
                <input type="hidden" id="ItemType" value="${Item.itemType}" readonly/>
                <button type="submit" class="btn btn-sm btn-danger mb-0">Disable</button>
                </form>`
            }else if(Item.Status == "applied"){
                CarryAction = `<a href="${Action}" class="btn btn-primary-soft me-1 mb-0" target=_blank>View</a>

                <form class='approvalForm'>
                <input type="hidden" id="ItemID" value="${Item.itemID}" readonly/>
                <input type="hidden" id="ItemType" value="${Item.itemType}" readonly/>
                <button type="submit" class="btn btn-sm btn-success-soft me-1 mb-1 mb-md-0">Approve</button>
                </form>

                <form class="rejectionForm">
                <input type="hidden" id="ItemID" value="${Item.itemID}" readonly/>
                <input type="hidden" id="ItemType" value="${Item.itemType}" readonly/>
                <button type="submit" class="btn btn-sm btn-danger mb-0">Reject</button>
                </form>`
            }else if(Item.Status == "rejected"){
                
                CarryAction = `<a href="${Action}" class="btn btn-primary-soft me-1 mb-0" target=_blank>View</a>

                <form class='approvalForm'>
                <input type="hidden" id="ItemID" value="${Item.itemID}" readonly/>
                <input type="hidden" id="ItemType" value="${Item.itemType}" readonly/>
                <button type="submit" class="btn btn-sm btn-success-soft me-1 mb-1 mb-md-0">Approve</button>
                </form>

                <form class="deletionForm">
                <input type="hidden" id="ItemID" value="${Item.itemID}" readonly/>
                <input type="hidden" id="ItemType" value="${Item.itemType}" readonly/>
                <button type="submit" class="btn btn-sm btn-danger mb-0">Delete</button>
                </form>
                `
            }

            // GEt Profile info For all Reviewers
            let ProfileSource
           
            fetch(`/admin/query/users/${Item.Owner}`, ()=>{
                method: "GET"
            }).then(res => res.json())
            .then(async data =>{
               
                const ReviewerData = JSON.parse(data.UserInfo)
                if(ReviewerData.length > 0){

                const ReviewerProfilePicture = ReviewerData[0].profile_picture
                const Fullname= `${ReviewerData[0].first_name} ${ReviewerData[0].last_name}`

                if(ReviewerProfilePicture == "avatar.jpg"){
                    ProfileSource = `https://eu.ui-avatars.com/api/?background=random&amp;name=${Fullname}&amp;font-size=0.6`
                }else{
                 
                    ProfileSource = await fetchProfileImage(ReviewerProfilePicture)

                }

            
            userResourceContainer.innerHTML += `
                <!-- Table PDF item -->
                <tr>
                    <!-- Course item -->
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="mb-0 ms-2">
                                <!-- Title -->
                                <h6><a href="#">${Item.title}</a></h6>
                            </div>
                        </div>
                    </td>
                    <td>
                    <div class="d-flex align-items-center mb-3">
                        <!-- Avatar -->
                        <div class="avatar avatar-xs flex-shrink-0">
                            <img class="avatar-img rounded-circle" src="${ProfileSource}" alt="avatar">
                        </div>
                        <!-- Info -->
                        <div class="ms-2">
                            <h6 class="mb-0 fw-light">${Fullname} (${Item.Owner})</h6>
                        </div>
                    </div>
                </td>


                    <!-- Assset Type -->
                    <td>
                        ${TypeText}
                    </td>
                    <td>
                        <div class="badge bg-success bg-opacity-10 text-success">${Item.Status}</div>
                    </td>
                  
                    <!-- Action item -->
                    <td class="action-table">
                    ${CarryAction}
                    </td>
                 
                    
                    

                </tr>`;
                InitializeForms()
            }

            })
        });
    }
    else{
        userResourceContainer.innerHTML = `<tr><td>No Data Available at the moment</td></tr>`
    }
    // }

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

function generatePaginationHTML(currentPage, totalPages, PrevPage, NexxtPage, ForQuery) {
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

NewPage(1, "regular");




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
    fetch(`/myAssets/search/q/${searchForResources.value}?page=${page}`, ()=>{
        method : "GET"
    }).then(res => res.json())
    .then(data =>{
        // console.log(data)
        renderResources(data, "search")
    })
 }

searchForResources.addEventListener("keyup", function(){
    if(searchForResources.value == "" || !searchForResources.value){
        NewPage(1, "regular")
    }
})


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
    fetch(`/myAssets/search/type/${filterType.value}?page=${page}`, ()=>{
        method : "GET"
    }).then(res => res.json())
    .then(data =>{
        // console.log(data)
        renderResources(data, "filter")
    })
}
}




// APPROVE, REJECT, DELETE 
function InitializeForms(){

const ApprovalForms = document.querySelectorAll(".approvalForm")
const rejectionForm = document.querySelectorAll(".rejectionForm")
const deletionForm = document.querySelectorAll(".deletionForm")

if(ApprovalForms.length > 0){
    ApprovalForms.forEach(form=>{
        form.addEventListener("submit", function(e){
            e.preventDefault()
            const ItemID = form.querySelector("#ItemID").value
            const ItemType = form.querySelector("#ItemType").value
            ApproveItem(ItemID, ItemType)
        })
    })
}


if(rejectionForm.length > 0){
    rejectionForm.forEach(form=>{
        form.addEventListener("submit", function(e){
            e.preventDefault()
            const ItemID = form.querySelector("#ItemID").value
            const ItemType = form.querySelector("#ItemType").value
            RejectItem(ItemID, ItemType)       
        })
    })
}

if(deletionForm.length > 0){
    deletionForm.forEach(form=>{
        form.addEventListener("submit", function(e){
            e.preventDefault()
            const ItemID = form.querySelector("#ItemID").value
            const ItemType = form.querySelector("#ItemType").value
          DeleteItem(ItemID, ItemType)
        })
    })
}

}

// Approve and item 
function ApproveItem(ItemId, ItemType){
    fetch(`/approveResource/${ItemType}?ItemID=${ItemId}`, ()=>{
        method:"GET"
    }).then(res => res.json())
    .then(data =>{
        
        if(data.status === "success"){
            alert(data.message)
            window.location.reload()
        }else if(data.status === "error"){
            alert(data.message)
        }
    })
}

// Reject an Item 
function RejectItem(ItemId, ItemType){
    fetch(`/rejectResource/${ItemType}?ItemID=${ItemId}`, ()=>{
        method:"GET"
    }).then(res => res.json())
    .then(data =>{
        if(data.status === "success"){
            alert(data.message)
            window.location.reload()
        }else if(data.status === "error"){
            alert(data.message)
        }
    })
}

// Delete An Item 
function DeleteItem(ItemId, ItemType){
    fetch(`/deleteResource/${ItemType}?ItemID=${ItemId}`, ()=>{
        method:"GET"
    }).then(res => res.json())
    .then(data =>{
        if(data.status === "success"){
            alert(data.message)
            window.location.reload()
        }else if(data.status === "error"){
            alert(data.message)
        }
    })
}