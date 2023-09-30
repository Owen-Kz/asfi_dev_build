
const COURSE_IDCONTAINER = document.getElementById("tutorialCategory")
const reviewsContainer = document.getElementById("reviewsContainer")

function  NewReviewPage(page){

    if(COURSE_IDCONTAINER){
    fetch(`/getAllCourseReviews?courseID=${COURSE_IDCONTAINER.value}&page=${page}`, ()=>{
        method:"GET"
    }).then(res => res.json())
    .then(data =>{
        const reviewsArray = JSON.parse(data.queryArray)
       updateReviewsUI(reviewsArray)
    })
}
}

NewReviewPage(1)


function updateReviewsUI(reviewsArray){
    if(reviewsArray.length > 0){
        const reviews_first_child = document.getElementById("reviews_first_child")

        const reviewRating_first_child = reviewsArray[0].review_rating
        const review_content_first_child = reviewsArray[0].review_content
        const reviewerName_first_child = reviewsArray[0].reviewer_name
        const reviewer_username_first_child = reviewsArray[0].reviewer_username

        reviews_first_child.innerHTML =  ` <div class="d-sm-flex">
        <div>
            <div class="mb-3 d-sm-flex justify-content-sm-between align-items-center">
                <!-- Title -->
                <div>
                    <h5 class="m-0">${reviewerName_first_child}</h5>
                    <span class="me-3 small">${reviewer_username_first_child}</span>
                </div>
                
                <ul class="list-inline mb-0" data-count="${reviewRating_first_child}">
                    
                <li class="list-inline-item me-0"><i class="fa-star text-warning far"></i></li>
                <li class="list-inline-item me-0"><i class="fa-star text-warning far"></i></li>
                <li class="list-inline-item me-0"><i class="fa-star text-warning far"></i></li>
                <li class="list-inline-item me-0"><i class="far fa-star text-warning"></i></li>
                <li class="list-inline-item me-0"><i class="far fa-star text-warning"></i></li>
                <small>${reviewRating_first_child} / 5 </small>
                </ul>	
            </div>
            <!-- Content -->
            <p>${review_content_first_child}</p>
        </div>
    </div>
    <!-- Divider -->
    <hr>
    <!-- Review item END -->`


        for(i=1; i < reviewsArray.length; i++) {
            const reviewRating = reviewsArray[i].review_rating
            const review_content = reviewsArray[i].review_content
            const reviewerName = reviewsArray[i].reviewer_name
            const reviewer_username = reviewsArray[i].reviewer_username

            reviewsContainer.innerHTML += ` <div class="d-sm-flex">
            <div>
                <div class="mb-3 d-sm-flex justify-content-sm-between align-items-center">
                    <!-- Title -->
                    <div>
                        <h5 class="m-0">${reviewerName}</h5>
                        <span class="me-3 small">${reviewer_username}</span>
                    </div>
                    
                    <ul class="list-inline mb-0" data-count="${reviewRating}">
                        
                    <li class="list-inline-item me-0"><i class="fa-star text-warning far"></i></li>
                    <li class="list-inline-item me-0"><i class="fa-star text-warning far"></i></li>
                    <li class="list-inline-item me-0"><i class="fa-star text-warning far"></i></li>
                    <li class="list-inline-item me-0"><i class="far fa-star text-warning"></i></li>
                    <li class="list-inline-item me-0"><i class="far fa-star text-warning"></i></li>
                    <small>${reviewRating} / 5 </small>
                    </ul>	
                </div>
                <!-- Content -->
                <p>${review_content}</p>
            </div>
        </div>
        <!-- Divider -->
        <hr>
        <!-- Review item END -->
       `            

        }
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
    }
}