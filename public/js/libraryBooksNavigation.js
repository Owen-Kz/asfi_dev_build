function booksNavigation(totalPagesBooks, currentPageBooks) {
  const booksNavContainer = document.getElementById("booksNavigation");
  let Previous = "";
  let AfterPrevious = "";
  let EndPage = "";
  let TotalPagesCount = "";
  let nextPageContainer = "";
  let OtherPages = "";

  if (totalPagesBooks > 0) {
    if (currentPageBooks > 1) {
      Previous = `<li class="page-item mb-0">
        <a class="page-link" href="?pageBook=${currentPageBooks - 1}" tabindex="-1" id="prevBookPage">
          <i class="fas fa-angle-double-left"></i>
        </a>
      </li>`;
    }

    const maxPagesToShow = 5;
    const halfMax = Math.floor(maxPagesToShow / 2);
    const startPage = Math.max(currentPageBooks - halfMax, 1);
    const endPage = Math.min(currentPageBooks + halfMax, totalPagesBooks);
    const nextPage = currentPageBooks + 1;

    if (startPage > 1) {
      AfterPrevious = `<li class="page-item mb-0">
        <a class="page-link" href="?pageBook=1">1</a>
      </li>`;

      if (startPage > 2) {
        AfterPrevious += `<li class="page-item mb-0"><a class="page-link" href="#">..</a></li>`;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      let active = (i == currentPageBooks ? 'active' : '');
      OtherPages += `<li class="page-item mb-0 ${active}">
        <a class="page-link" href="?pageBook=${i}">${i}</a>
      </li>`;
    }

    if (endPage < totalPagesBooks) {
      if (endPage < totalPagesBooks - 1) {
        EndPage = `<li class="page-item mb-0"><a class="page-link" href="#">..</a></li>`;
      }
      TotalPagesCount = `
      <li class="page-item mb-0"><a class="page-link" href="?pageBook=${totalPagesBooks}">${totalPagesBooks}</a></li>`;
    }

    if (currentPageBooks < totalPagesBooks) {
      nextPageContainer = `<li class="page-item mb-0">
        <a class="page-link" href="?pageBook=${nextPage}" id="nextBookPage">
          <i class="fas fa-angle-double-right"></i>
        </a>
      </li>`;
    }
  }

  booksNavContainer.innerHTML = `
    <ul class="pagination pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
      ${Previous}
      ${AfterPrevious}
      ${OtherPages}
      ${EndPage}
      ${TotalPagesCount}
      ${nextPageContainer}
    </ul>
    <span id="bookPageInfo">Page ${currentPageBooks} of ${totalPagesBooks}</span>`;
}

export {
  booksNavigation
};
