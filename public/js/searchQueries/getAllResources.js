const userResourceContainer = document.getElementById("userResourceContainer")

const footerContainer = document.getElementById("footer_container")

async function NewPage(page) {
    const response = await fetch(`/getAllResources?page=${page}`);
    const data = await response.json();
    renderResources(data);
}

function renderResources(data) {
    userResourceContainer.innerHTML = "";  // Clear previous content
    

    if (data) {
        const queryResult = JSON.parse(data.queryArray);
        if(queryResult.length > 0){
        queryResult.forEach(Item => {

            let TypeText = '';
            if (Item.itemType === "book") {
                TypeText = `<span class="badge bg-primary bg-opacity-10 text-primary">BOOK</span>`;
            } else if (Item.itemType === "link") {
                TypeText = `<span class="badge bg-primary bg-opacity-10 text-primary">PUBLICATION LINK</span>`;
            } else if (Item.itemType === "podcast") {
                TypeText = `<span class="badge bg-purple bg-opacity-10 text-purple">PODCAST</span>`;
            } else if (Item.itemType === "tutorial") {
                TypeText = `<span class="badge bg-warning bg-opacity-10 text-warning">TUTORIAL</span>`;
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
                        <div class="badge bg-success bg-opacity-10 text-success">${Item.Status}</div>
                    </td>
                    <!-- Assset Type -->
                    <td>
                        ${TypeText}
                    </td>
                    <!-- Action item -->
                    <td class="action-table">
                        <form class="editAssetForm" onsubmit="return false">
                            <input type="hidden" id="editResourceID" value="${Item.itemID}" >
                            <input type="hidden" id="editResourceType" value="${Item.itemType}">
                            <button class="btn btn-sm btn-success-soft btn-round me-1 mb-0" data-bs-toggle="modal" data-bs-target="#editAction"><i class="far fa-fw fa-edit"></i></button>
                        </form>
                        <br>
                        <form class="deleteAssetForm" onsubmit="return false">
                            <input type="hidden" id="deleteResourceID" value="${Item.itemID}" readonly>
                            <input type="hidden" id="deleteResourceType" value="${Item.itemType}" readonly>
                            <button class="btn btn-sm btn-danger-soft btn-round mb-0" data-bs-toggle="modal" data-bs-target="#deleteAction"><i class="fas fa-fw fa-times"></i></button>
                        </form>
                    </td>
                </tr>`;
        });
    }
    else{
        userResourceContainer.innerHTML = `<tr><td>No Data Available at the moment</td></tr>`
    }
    }

    // Render pagination
    const totalPages = data.totalPages;
    const currentPage = data.currentPage;
    const PrevPage = parseInt(currentPage, 10) - 1;
    const NexxtPage = parseInt(currentPage, 10) + 1;

    const paginationHTML = generatePaginationHTML(currentPage, totalPages, PrevPage, NexxtPage);
    footerContainer.innerHTML = paginationHTML;

    if(url == "/dashboard" ||  url == "/Dashboard"){
        hideActionButtons()
    }
}

function generatePaginationHTML(currentPage, totalPages, PrevPage, NexxtPage) {
    let paginationHTML = `
        <div class="d-sm-flex justify-content-sm-between align-items-sm-center mt-4 mt-sm-3">
            <p class="mb-0 text-center text-sm-start">Page ${currentPage} of ${totalPages}</p>
            <nav class="d-flex justify-content-center mb-0" aria-label="navigation">
                <ul class="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0" id="footer_list">`;

    if (currentPage > 1) {
        paginationHTML += `<li class="page-item mb-0"><a class="page-link" onClick="NewPage(${PrevPage})" tabindex="-1"><i class="fas fa-angle-left"></i></a></li>`;
    }

    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<li class="page-item mb-0 active"><a class="page-link" href="#"> ${i} </a></li>`;
        } else {
            paginationHTML += `<li class="page-item mb-0"><a class="page-link" onClick="NewPage(${i})">  ${i}  </a></li>`;
        }
    }

    if (currentPage < totalPages) {
        paginationHTML += `<li class="page-item mb-0"><a class="page-link" onClick="NewPage(${NexxtPage})"><i class="fas fa-angle-right"></i></a></li>`;
    } else if(currentPage > totalPages) {
        paginationHTML += `<li class="page-item mb-0 disabled"><span class="page-link"><i class="fas fa-angle-right"></i></span></li>`;
    }

    paginationHTML += `</ul>
    </nav>
    </div>`;

    return paginationHTML;
}

NewPage(1);



// Search for Courses 
const searchResources = document.getElementById("searchResources")
const searchForResources = document.getElementById("searchForResources")

if(searchResources){
searchResources.addEventListener("submit", function(e){
    e.preventDefault();
    
    if(searchForResources.value == "" || !searchForResources.value){
        NewPage(1)
    }else{
    fetch(`/myAssets/search/q/${searchForResources.value}`, ()=>{
        method : "GET"
    }).then(res => res.json())
    .then(data =>{
        // console.log(data)
        renderResources(data)
    })
}
})
searchForResources.addEventListener("keyup", function(){
    if(searchForResources.value == "" || !searchForResources.value){
        NewPage(1)
    }
})



// Filter By CAtegory 
const filterByType = document.getElementById("filterByType")
const submitFilter = document.getElementById("submitFilter")
const filterType = document.getElementById("filterType")

filterType.addEventListener("change", function(){
    if(filterType.value !== ""){
        submitFilter.click()
    }else{
        NewPage(1)
    }
})

filterByType.addEventListener("submit", function(e){
    e.preventDefault()
    fetch(`/myAssets/search/type/${filterType.value}`, ()=>{
        method : "GET"
    }).then(res => res.json())
    .then(data =>{
        // console.log(data)
        renderResources(data)
    })
})
}