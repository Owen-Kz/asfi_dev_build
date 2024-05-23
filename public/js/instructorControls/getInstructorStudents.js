const table_container = document.getElementById("table_container")
let footer_container
let footer_list

// TRY NEW PAGE 
function NewPage(page) {
  const footerContainer = document.getElementById('footer_container');
  
    fetch(`/getInstructorStudents?page=${page}`, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(data => {
        const totalPages = data.totalPages;
        const currentPage = data.currentPage;
        const AllStudents_ = JSON.parse(data.All_insttructorStudents);
        const PrevPage = parseInt(currentPage, 10) - 1
        const NexxtPage = parseInt(currentPage, 10) + 1

        // Update your UI with the received data (AllStudents_)
        updateStudentUI(AllStudents_);
  
        // Update the pagination UI
        const paginationHTML = generatePaginationHTML(currentPage, totalPages, PrevPage, NexxtPage);
        footerContainer.innerHTML = paginationHTML;
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
    } else {
      // paginationHTML += `<li class="page-item mb-0 disabled"><span class="page-link"><i class="fas fa-angle-right"></i></span></li>`;
    }
  
    paginationHTML += `</ul>
    </nav>
    </div>`;
  
    return paginationHTML;
  }

NewPage(1)

  