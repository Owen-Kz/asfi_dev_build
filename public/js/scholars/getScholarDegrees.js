const username_container = document.getElementById("username_container")
const degrees_container = document.getElementById("degrees_container")

fetch(`/scholars/degrees/${username_container.innerText}`, ()=>{
    method:"GET"
}).then(res => res.json())
.then(data =>{
    const degrees = JSON.parse(data.Degrees)

    if(degrees.length > 0){
    degrees.forEach(degree => {
        const subText = degree.honorary_type
        degrees_container.innerHTML += `<span class="h6 mb-0">${subText},</span>,`
    });
   }
})



// GET RESOURCES 
const userResourceContainer = document.getElementById("userResourceContainer")

const footerContainer = document.getElementById("footer_container")

async function NewPage(page) {
    const response = await fetch(`/allResources/${username_container.innerText}?page=${page}`);
    const data = await response.json();
    renderResources(data);
}

function renderResources(data) {
    userResourceContainer.innerHTML = "";  // Clear previous content
    

    if (data) {
        const queryResult = JSON.parse(data.queryArray);
        if(queryResult.length > 0){
        queryResult.forEach(Item => {
            let Action
            let TypeText = '';
            if (Item.itemType === "book") {
                TypeText = `<span class="badge bg-primary bg-opacity-10 text-primary">BOOK</span>`;
                Action = ` <a href="https://asfi-demo-app-2cbea9ef1c2f.herokuapp.com/library/books/${Item.File}" class="btn btn-sm btn-info-soft mb-0"  >View</a>`

            } else if (Item.itemType === "link") {
                TypeText = `<span class="badge bg-primary bg-opacity-10 text-primary">PUBLICATION LINK</span>`;
                Action = ` <a href="${Item.title}" class="btn btn-sm btn-info-soft mb-0"   target="_blank">View</a>`
            } else if (Item.itemType === "podcast") {
                TypeText = `<span class="badge bg-purple bg-opacity-10 text-purple">PODCAST</span>`;
                Action = ` <a href="https://asfi-demo-app-2cbea9ef1c2f.herokuapp.com/userUploads/Audio/${Item.File}" class="btn btn-sm btn-info-soft mb-0"  >View</a>`
            } else if (Item.itemType === "tutorial") {
                TypeText = `<span class="badge bg-warning bg-opacity-10 text-warning">TUTORIAL</span>`;
                Action = ` <a href="https://asfi-demo-app-2cbea9ef1c2f.herokuapp.com/userUploads/Videos/${Item.File}" class="btn btn-sm btn-info-soft mb-0"  >View</a>`
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
                    <!-- Assset Type -->
                    <td>
                        ${TypeText}
                    </td>
                    <td>
                        <div class="badge bg-success bg-opacity-10 text-success">${Item.Status}</div>
                    </td>
                  
                    <!-- Action item -->
                    <td class="action-table">
                    ${Action}
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


