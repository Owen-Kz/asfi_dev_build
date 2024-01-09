
const courseID = document.getElementById("course_details")
const course_title_container = document.getElementById("course_title")
const course_description_container = document.getElementById("course_description")
const course_owner_fullname_container = document.getElementById("course_owner_fullname")
const course_owner_title_container = document.getElementById("course_owner_title")
const course_duration_container = document.getElementById("course_duration")
const total_students_container = document.getElementById("total_students")
const course_level_container = document.getElementById("course_level")
const total_lectures_container = document.getElementById("total_lectures")
const course_reviews_container = document.getElementById("course_reviews_container")
const owner_profile_picture = document.getElementById("owner_profile_picture")
const footerContainer = document.getElementById("footer_container")


fetch(`/getcoursedetails/${courseID.value}`, ()=>{
    method: "GET"
}).then(res => res.json())
.then(data => {
    const Course = JSON.parse(data.courseDetail)
    if(Course.length > 0){
        const course_title = Course[0].course_name
        const Course_Owner = Course[0].course_instructor
        const course_thumbnail = Course[0].course_thumbnail
        const course_category = Course[0].category
        const course_duration = Course[0].course_duration
        const course_description = Course[0].course_description
        const course_level = Course[0].course_level

        // Get the instructors info 
        fetch(`/admin/query/users/${Course_Owner}`, ()=>{
            method: "GET"            
        }).then(res => res.json())
        .then(data => {
            const owner = JSON.parse(data.UserInfo)
            if(owner.length > 0){
            const owner_first_name = owner[0].first_name
            const last_name = owner[0].last_name
            const Title = owner[0].title
            const prefix = owner[0].prefix
            const profilePic = owner[0].profile_picture
            
            course_title_container.innerHTML = `<span>${course_title}</span>`
            course_description_container.innerHTML = `<span>${course_description}</span>`
            course_level_container.innerHTML = `<span>${course_level}</span>`
            course_duration_container.innerHTML = `<span>${course_duration} </span>`
            course_owner_fullname_container.innerHTML = `<span>${prefix}. ${owner_first_name} ${last_name}`
            course_owner_title_container.innerHTML = `<span>${Title}</span>`
            owner_profile_picture.src = `https://asfi-demo-app-2cbea9ef1c2f.herokuapp.com/userUploads/profileImages/${profilePic}`
            }
       
        })
    }
})



// Get the Total Nnumber of Enrolled Students 
fetch(`/enrolledstudents/${courseID.value}`, ()=>{
    mehod:"GET"
}).then(res => res.json())
.then(data =>{
    const enrolledSTudentsCount = data.enrolledCount
    total_students_container.innerHTML = `<span>${enrolledSTudentsCount}</span>`;
})

// Get the Reviews for the course 

function NewPage(page) {
    fetch(`/courseReviews/${courseID.value}?page=${page}`, ()=>{
        method: "GET"
    }).then(res => res.json())
    .then(data =>{
        const Reviews = JSON.parse(data.course_reviews)
        const CurrentPage = data.currentPageReviews
        const TotalPages = data.totalPagesReviews
        const TotalReviews = data.totalReviews
        const PrevPage = Math.floor(parseInt(CurrentPage) - 1)
        const NexxtPage = Math.floor(parseInt(CurrentPage) + 1)

        course_reviews_container.innerHTML = ""
        if(Reviews.length > 0){
            Reviews.forEach(review => {
                const ReviewerUsername = review.reviewer_username
                const ReviewerFullname = review.reviewer_name
                const ReviewRating = review.review_rating
                const ReviewRetrievedId = review.review_id
                const review_date = formatTimestamp(review.review_date)

                let ProfileSource

                

                // GEt Profile info For all Reviewers
                fetch(`/admin/query/users/${ReviewerUsername}`, ()=>{
                    method: "GET"
                }).then(res => res.json())
                .then(data =>{
                    const ReviewerData = JSON.parse(data.UserInfo)

                    if(ReviewerData.length > 0){

                    
                    const ReviewerProfilePicture = ReviewerData[0].profile_picture

                    if(ReviewerProfilePicture == "avatar.jpg"){
                        ProfileSource = `https://eu.ui-avatars.com/api/?background=random&amp;name=${ReviewerFullname}&amp;font-size=0.6`
                    }else{
                        ProfileSource = `https://asfi-demo-app-2cbea9ef1c2f.herokuapp.com/userUploads/profileImages/${ReviewerProfilePicture}`
                    }

                    course_reviews_container.innerHTML += `<tr>
                    <!-- Table data -->
                    <td>
                        <div class="d-flex align-items-center position-relative">
                            <!-- Image -->
                            <div class="avatar avatar-xs mb-2 mb-md-0">
                                <img src="${ProfileSource}" class="rounded-circle" alt="">
                            </div>
                            <div class="mb-0 ms-2">
                                <!-- Title -->
                                <h6 class="mb-0"><a href="#" class="stretched-link">${ReviewerFullname}</a></h6>
                            </div>
                        </div>
                    </td>
                   
                    <td class="text-center text-sm-start">
                    <h6 class="mb-0">${review_date}</h6>
                    </td>

                    <!-- Table data -->
                    <td>
                        <ul class="list-inline mb-0" data-count=${ReviewRating}>
                            <li class="list-inline-item me-0 small"><i class="fas fa-star text-warning"></i></li>
                            <li class="list-inline-item me-0 small"><i class="fas fa-star text-warning"></i></li>
                            <li class="list-inline-item me-0 small"><i class="fas fa-star text-warning"></i></li>
                            <li class="list-inline-item me-0 small"><i class="fas fa-star text-warning"></i></li>
                            <li class="list-inline-item me-0 small"><i class="fas fa-star text-warning"></i></li>
                        </ul>
                    </td>
    
                    <!-- Table data -->
                    <td>
                    <form class='reviewForm'>
                    <input type='hidden' value="${ReviewRetrievedId}" id="review_id_view"/>
                        <button type="submit" class="btn btn-sm btn-info-soft mb-0" data-bs-toggle="modal" data-bs-target="#viewReview">View
                        </button>
                        </form>
                        <button class="btn btn-sm btn-danger-soft me-1 mb-1 mb-md-0" data-bs-toggle="modal" data-bs-target="#deleteReview">Delete</button>
                    </td>
                </tr>
    `
    InitializeForms()
    StarCount()
}
                })
            
            });
            if(TotalPages > 0){
                // Update the pagination UI
                if(footerContainer){
               const paginationHTML = paginationFotTutorials(CurrentPage, TotalPages, PrevPage, NexxtPage);
               footerContainer.innerHTML = paginationHTML;
                }
            }

        }else{
          course_reviews_container.innerHTML =  `<tr><td>Nothing to show</td></tr>`
          footerContainer.innerHTML = ""
        }
    }) 
} 
NewPage(1)

// Get ReviewContent to show in the Modal when the View button is clicked
async function InitializeForms() {
const ViewReviewForms = document.querySelectorAll(".reviewForm")
const viewReviewModal = document.getElementById("viewReviewModalBody")
ViewReviewForms.forEach(form => {
    
    const ReviewID = form.querySelector("#review_id_view")
   

    form.addEventListener("submit", (e)=>{
        e.preventDefault()
        viewReviewModal.innerHTML = ""
        
        fetch(`/openReview/${ReviewID.value}`, ()=>{
            method:"GET"
        }).then(res => res.json())
        .then(data =>{

            const ReviewItem = JSON.parse(data.course_reviews_item)

            if(ReviewItem.length > 0){
                
                    const ReviewerUsername = ReviewItem[0].reviewer_username
                    const ReviewerFullname = ReviewItem[0].reviewer_name
                    const ReviewContent = ReviewItem[0].review_content
                    const ReviewRetrievedId = ReviewItem[0].review_id
                    const ReviewDate = formatTimestamp(ReviewItem[0].review_date)
         
                    // const ReviewerProfilePicture = review.reviewer_profile_picture
                    const ReviewRating = ReviewItem[0].review_rating
                    fetch(`/admin/query/users/${ReviewerUsername}`, ()=>{
                        method: "GET"
                    }).then(res => res.json())
                    .then(data => {
                        const ReviewerData = JSON.parse(data.UserInfo)
                        const ReviewerProfilePicture = ReviewerData[0].profile_picture  
                        let ProfileSource
                    if(ReviewerProfilePicture == "avatar.jpg"){
                        ProfileSource = `https://eu.ui-avatars.com/api/?background=random&amp;name=${ReviewerFullname}&amp;font-size=0.6`
                    }else{
                        ProfileSource = `https://asfi-demo-app-2cbea9ef1c2f.herokuapp.com/userUploads/profileImages/${ReviewerProfilePicture}`
                    }
                    viewReviewModal.innerHTML = `<div class="d-md-flex">
					<!-- Avatar -->
					<div class="avatar avatar-md me-4 flex-shrink-0">
						<img class="avatar-img rounded-circle" src="${ProfileSource}" alt="avatar">
					</div>
					<!-- Text -->
					<div>
						<div class="d-sm-flex mt-1 mt-md-0 align-items-center">
							<h5 class="me-3 mb-0">${ReviewerFullname}</h5>
							<!-- Review star -->
							<ul class="list-inline mb-0" data-count=${ReviewRating}>
								<li class="list-inline-item me-0"><i class="fas fa-star text-warning"></i></li>
								<li class="list-inline-item me-0"><i class="fas fa-star text-warning"></i></li>
								<li class="list-inline-item me-0"><i class="fas fa-star text-warning"></i></li>
								<li class="list-inline-item me-0"><i class="fas fa-star text-warning"></i></li>
								<li class="list-inline-item me-0"><i class="far fa-star text-warning"></i></li>
							</ul>
						</div>
						<!-- Info -->
						<p class="small mb-2">${ReviewDate}</p>
						<p class="mb-2"> ${ReviewContent} </p>
						
					</div>	
				</div>
			</div>
            <!-- Modal footer -->
			<div class="modal-footer">
				<button type="button" class="btn btn-danger-soft my-0" data-bs-dismiss="modal">Close</button>
			</div>`;
            StarCount()

                    })
                
           
            }
        })
    })
})
}

