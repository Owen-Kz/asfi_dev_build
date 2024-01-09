// GET CourseS 
const userCourseContainer = document.getElementById("userCourseContainer")

const footerContainer = document.getElementById("footer_container")

async function NewPage(page) {
    const response = await fetch(`/allInstructorCourses/${username_container.innerText}?page=${page}`);
    const data = await response.json();
    renderCourses(data);
}

function renderCourses(data) {
    userCourseContainer.innerHTML = "";  // Clear previous content
    

    if (data) {
        const queryResult = JSON.parse(data.queryArray);
        if(queryResult.length > 0){
        queryResult.forEach(Item => {
            let Action
       

            if(Item.Status == "applied"){
            Action = `<span class="badge bg-warning bg-opacity-15 text-warning">Pending</span>`
            }else if(Item.Status == "rejected"){
            Action = `<span class="badge bg-danger bg-opacity-15 text-danger">Canceled</span>`
            }else if(Item.Status == "Live"){
            Action  `<span class="badge bg-success bg-opacity-15 text-success">Live</span>`
            }

            fetch(`/students/enrolled/courses/${Item.courseID}`, ()=>{
                method :"GET"
            }).then(res => res.json())
            .then(data =>{
                const ENrolledCount = data.ENrolledCount
         

            userCourseContainer.innerHTML += `
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
                    <td>${ENrolledCount}</td>
                    <td>
                       ${Action}
                    </td>
          
                </tr>`;
            })
        });
    }
    else{
        userCourseContainer.innerHTML = `<tr><td>No Data Available at the moment</td></tr>`
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


