function LinksPagination(totalPagesLinks, currentpageLinks){
    const LinksPaginationContainer = document.getElementsByName("LinksPaginationContainer")
    let Previous = "";
  let AfterPrevious = "";
  let EndPage = "";
  let TotalPagesCount = "";
  let nextPageContainer = "";
  let OtherPages = "";

  if (totalPagesLinks > 0) {
    if (currentpageLinks > 1) {
      Previous = `<li class="page-item mb-0">
        <a class="page-link" href="?pageLink=${currentpageLinks - 1}" tabindex="-1" id="prevBookPage">
          <i class="fas fa-angle-double-left"></i>
        </a>
      </li>`;
    }

    const maxPagesToShow = 5;
    const halfMax = Math.floor(maxPagesToShow / 2);
    const startPage = Math.max(currentpageLinks - halfMax, 1);
    const endPage = Math.min(currentpageLinks + halfMax, totalPagesLinks);
    const nextPage = currentpageLinks + 1;

    if (startPage > 1) {
      AfterPrevious = `<li class="page-item mb-0">
        <a class="page-link" href="?pageLink=1">1</a>
      </li>`;

      if (startPage > 2) {
        AfterPrevious += `<li class="page-item mb-0"><a class="page-link" href="#">..</a></li>`;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      let active = (i === currentpageLinks ? 'active' : '');
      OtherPages += `<li class="page-item mb-0 ${active}">
        <a class="page-link" href="?pageLink=${i}">${i}</a>
      </li>`;
    }

    if (endPage < totalPagesLinks) {
      if (endPage < totalPagesLinks - 1) {
        EndPage = `<li class="page-item mb-0"><a class="page-link" href="#">..</a></li>`;
      }
      TotalPagesCount = `
      <li class="page-item mb-0"><a class="page-link" href="?pageLink=${totalPagesLinks}">${totalPagesLinks}</a></li>`;
    }

    if (currentpageLinks < totalPagesLinks) {
      nextPageContainer = `<li class="page-item mb-0">
        <a class="page-link" href="?pageLink=${nextPage}" id="nextBookPage">
          <i class="fas fa-angle-double-right"></i>
        </a>
      </li>`;
    }
  } 

  LinksPaginationContainer.innerHTML = `
    <ul class="pagination pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
      ${Previous}
      ${AfterPrevious}
      ${OtherPages}
      ${EndPage}
      ${TotalPagesCount}
      ${nextPageContainer}
    </ul>
    <span id="bookPageInfo">Page ${currentpageLinks} of ${totalPagesLinks}</span>`;
}
 
export {
    LinksPagination
}