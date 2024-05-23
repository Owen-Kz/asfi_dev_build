
const reviewsContainer = document.getElementById("reviewsContainer")
const footerContainer = document.getElementById("footer_container")

async function newPage(page) {
    const response = await fetch(`/getAllReviews?page=${page}`);
    const data = await response.json();
    renderReviews(data);
}

function renderReviews(data) {

    if (data) {
        reviewsContainer.innerHTML = ""
        const ReviewsArray = JSON.parse(data.queryArray)

        if (ReviewsArray.length > 0) {
            ReviewsArray.forEach(review => {
                const course_name = review.course_name
                const review_content = review.review_content
                const review_rating = new Number(review.review_rating)
                const reviewer_name = review.reviewer_name
                const reviewer_username = review.reviewer_username
                const review_id = review.review_id
                const course_id = review.course_id
                const course_owner_username = review.course_owner_username

                // const TotalRatings = Math.floor(5 - review_rating)



                reviewsContainer.innerHTML += `<div class="d-sm-flex">
        <div>
            <div class="mb-3 d-sm-flex justify-content-sm-between align-items-center">
                <!-- Title -->
                <div>
                    <h5 class="m-0">${reviewer_name}</h5>
                    <span class="me-3 small">${reviewer_username}</span>
                </div>
                
                <ul class="list-inline mb-0" data-count="${review_rating}">
                    
                <li class="list-inline-item me-0"><i class="far fa-star text-warning"></i></li>
                <li class="list-inline-item me-0"><i class="far fa-star text-warning"></i></li>
                <li class="list-inline-item me-0"><i class="far fa-star text-warning"></i></li>
                <li class="list-inline-item me-0"><i class="far fa-star text-warning"></i></li>
                <li class="list-inline-item me-0"><i class="far fa-star text-warning"></i></li>
                <small>${review_rating} / 5 </small>
                </ul>	
            </div>
            <!-- Content -->
            <h6><span class="text-body fw-light">Review on:</span> ${course_name}</h6>
            <p>${review_content} </p>
            <!-- Button -->
            <div class="text-end">
                <a href="/@${reviewer_username}/chat" class="btn btn-sm btn-primary-soft mb-1 mb-sm-0">Direct message</a>
                <!-- collapse textarea -->
                <div class="collapse show" id="collapseComment">
        
                </div>
            </div>
        </div>
    </div>
    <!-- Divider -->
    <hr>
    <!-- Review item END -->
    `

                // Get all <ul> elements with the specified data-count attribute
                const ulElements = document.querySelectorAll('ul[data-count]');

                ulElements.forEach(ulElement => {
                    // Get the data-count value and convert it to a number
                    const count = parseInt(ulElement.getAttribute('data-count'));

                    // Get all <i> elements within this <ul>
                    const starIcons = ulElement.querySelectorAll('li i');

                    // Iterate through the <i> elements and update their class based on the count
                    for (let i = 0; i < starIcons.length; i++) {
                        if (i < count) {
                            starIcons[i].classList.remove('far');
                            starIcons[i].classList.add('fas');
                        } else {
                            starIcons[i].classList.remove('fas');
                            starIcons[i].classList.add('far');
                        }
                    }
                });

            })
        } else {
            reviewsContainer.innerHTML = "No reviews yet"
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
            } else if (currentPage > totalPages) {
                paginationHTML += `<li class="page-item mb-0 disabled"><span class="page-link"><i class="fas fa-angle-right"></i></span></li>`;
            }

            paginationHTML += `</ul>
   </nav>
   </div>`;

            return paginationHTML;
        }
    }


}

newPage(1)


const sortbyRating = document.getElementById("sortbyRating")
const sortRating = document.getElementById("sortRating")
const submitSort = document.getElementById("submitSort")
sortRating.addEventListener("change", function () {
    if (sortRating.value !== "") {
        submitSort.click()
    } else {
        newPage(1)
    }

})

sortbyRating.addEventListener("submit", function (e) {
    e.preventDefault();

    fetch(`/instructorReviews/rating?sortRating=${sortRating.value}`, () => {
        method: "GET"
    }).then(res => res.json())
        .then(data => {
            renderReviews(data)
        })
})

