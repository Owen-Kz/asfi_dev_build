
function newCoursePage(page){
let footer_container
let footer_list
const footerContainer = document.getElementById('footer_container');

fetch(`/getInstructorCourse?page=${page}`, ()=>{
    method: "GET"
}).then(res => res.json())
.then(data =>{
    // if(data){
    const AllCourses = JSON.parse(data.All_InstructorCourses)

const totalPages = data.totalPages;
const currentPage = data.currentPage;
const PrevPage = parseInt(currentPage, 10) - 1
const NexxtPage = parseInt(currentPage, 10) + 1

// Update your UI with the received data (AllStudents_)
updateCourseUI(AllCourses)


// Update the pagination UI
const paginationHTML = generatePaginationHTML(currentPage, totalPages, PrevPage, NexxtPage);
if(footerContainer){
footerContainer.innerHTML = paginationHTML;
}
})

.catch(error => console.error('Error:', error));
}


function generatePaginationHTML(currentPage, totalPages, PrevPage, NexxtPage) {
let paginationHTML = `<div class="d-sm-flex justify-content-sm-between align-items-sm-center mt-4 mt-sm-3">
<!-- Content -->

<p class="mb-0 text-center text-sm-start">Page ${currentPage} of ${totalPages}</p>
<!-- Pagination -->
<nav class="d-flex justify-content-center mb-0" aria-label="navigation">
<ul class="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0" id="footer_list">`;

if (currentPage > 1) {
paginationHTML += `<li class="page-item mb-0"><a class="page-link" onClick="newCoursePage(${PrevPage})" tabindex="-1"><i class="fas fa-angle-left"></i></a></li>`;
}

for (let i = 1; i <= totalPages; i++) {
if (i === currentPage) {
paginationHTML += `<li class="page-item mb-0 active"><a class="page-link" href="#"> ${i} </a></li>`;
} else {
paginationHTML += `<li class="page-item mb-0"><a class="page-link" onClick="newCoursePage(${i})">  ${i}  </a></li>`;
}
}

if (currentPage < totalPages) {
paginationHTML += `<li class="page-item mb-0"><a class="page-link" onClick="newCoursePage(${NexxtPage})"><i class="fas fa-angle-right"></i></a></li>`;
} else {
// paginationHTML += `<li class="page-item mb-0 disabled"><span class="page-link"><i class="fas fa-angle-right"></i></span></li>`;
}

paginationHTML += `</ul>
</nav>
</div>`;

return paginationHTML;
}
newCoursePage(1)


// filter Courses by status 
const sortByStatusForm = document.getElementById("sortByStatusForm")
const sortByStatus = document.getElementById("sortByStatus")
const submitSort = document.getElementById("submitSort")


// GENERATE NEW PAGES ON FILTER 
function newCoursePageOnFilter(page, sortStatus){
    let footer_container
    let footer_list
    const footerContainer = document.getElementById('footer_container');
    
    fetch(`/getInstructorCourse?page=${page}&sortBy=${sortStatus}`, ()=>{
        method: "GET"
    }).then(res => res.json())
    .then(data =>{
        // if(data){
        const AllCourses = JSON.parse(data.All_InstructorCourses)
    
    const totalPages = data.totalPages;
    const currentPage = data.currentPage;
    const PrevPage = parseInt(currentPage, 10) - 1
    const NexxtPage = parseInt(currentPage, 10) + 1
    const status = data.course_status
    
    // Update your UI with the received data (AllStudents_)
    updateCourseUI(AllCourses)    
    // Update the pagination UI
    const paginationHTML = generatePaginationHTMLSort(currentPage, totalPages, PrevPage, NexxtPage, status);
    footerContainer.innerHTML = paginationHTML;
    })
    
    .catch(error => console.error('Error:', error));
    }
    
    
    function generatePaginationHTMLSort(currentPage, totalPages, PrevPage, NexxtPage, status) {
    let paginationHTML = `<div class="d-sm-flex justify-content-sm-between align-items-sm-center mt-4 mt-sm-3">
    <!-- Content -->
    <p class="mb-0 text-center text-sm-start">Page ${currentPage} of ${totalPages}</p>
    <!-- Pagination -->
    <nav class="d-flex justify-content-center mb-0" aria-label="navigation">
    <ul class="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0" id="footer_list">`;
    
    if (currentPage > 1) {
    paginationHTML += `<li class="page-item mb-0"><a class="page-link" onClick="newCoursePageOnFilter(${PrevPage}, ${status})" tabindex="-1"><i class="fas fa-angle-left"></i></a></li>`;
    }
    
    for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
    paginationHTML += `<li class="page-item mb-0 active"><a class="page-link" href="#"> ${i} </a></li>`;
    } else {
    paginationHTML += `<li class="page-item mb-0"><a class="page-link" onClick="newCoursePageOnFilter(${i}, ${status})">  ${i}  </a></li>`;
    }
    }
    
    if (currentPage < totalPages) {
    paginationHTML += `<li class="page-item mb-0"><a class="page-link" onClick="newCoursePageOnFilter(${NexxtPage}, ${status})"><i class="fas fa-angle-right"></i></a></li>`;
    } else {
    // paginationHTML += `<li class="page-item mb-0 disabled"><span class="page-link"><i class="fas fa-angle-right"></i></span></li>`;
    }
    
    paginationHTML += `</ul>
    </nav>
    </div>`;
    
    return paginationHTML;
    }


if(sortByStatus){
sortByStatus.addEventListener("change", function(){
    submitSort.click()
})

sortByStatusForm.addEventListener("submit", function(e){
    e.preventDefault();
    if(sortByStatus !== ""){
        newCoursePageOnFilter(1, sortByStatus.value)
    }else{
        newCoursePage(1)
    }
})
}


// search for a course
// Search for Courses 
const searchCourses = document.getElementById("searchCourses")
const searchForCourses = document.getElementById("searchForCourses")
if(searchCourses){
searchCourses.addEventListener("submit", function(e){
    e.preventDefault();
    
    if(searchForCourses.value == "" || !searchForCourses.value){
        newCoursePage(1)
    }else{
    fetch(`/mycourses/search/q/${searchForCourses.value}`, ()=>{
        method : "GET"
    }).then(res => res.json())
    .then(data =>{
        
        const  CourseSearchResult = JSON.parse(data.All_InstructorCourses)
        updateCourseUI(CourseSearchResult)
    })
}
})
searchForCourses.addEventListener("keyup", function(){
    if(searchForCourses.value == "" || !searchForCourses.value){
        newCoursePage(1)
    }
})
}
