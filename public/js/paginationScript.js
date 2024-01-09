
function paginationFotTutorials(currentPage, totalPages, PrevPage, NexxtPage){
    const pageCountContainer = document.getElementById("pageCountContainer")
if(pageCountContainer){
        pageCountContainer.innerHTML = `<p class="mb-0 text-center text-sm-start">Page ${currentPage} of ${totalPages}</p>`;

        let paginationHTML = `
        <nav class="mt-4 d-flex justify-content-center" aria-label="navigation">
        <ul class="pagination pagination-primary-soft d-inline-block d-md-flex rounded mb-0">

        <!-- Pagination -->
        <nav class="d-flex justify-content-center mb-0" aria-label="navigation">
        <ul class="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0" id="footer_list">`;
      
        if (currentPage > 1) {
            paginationHTML +=  `<li class="page-item mb-0">
            <a class="page-link" onClick="NewPage(${PrevPage})" tabindex="-1" id="prevTutorialPage">
              <i class="fas fa-angle-double-left"></i>
            </a>
          </li>`
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
       `;
      
        return paginationHTML;
}
}
