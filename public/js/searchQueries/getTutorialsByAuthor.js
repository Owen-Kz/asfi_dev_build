const tutorialOwnerContainer = document.getElementById("tutorialOwnerContainer").value
const tutorialsByAuthorContainerMain = document.getElementById("tutorialsByAuthorContainerMain")
const tutoialsOfSameCourse = document.getElementById("tutorialsInCategory")
const tutorialCategory = document.getElementById("tutorialCategory").value


fetch(`/${tutorialOwnerContainer}/tutorialsByAuthor`, ()=> {
    method:"GET"
}).then(res => res.json())
.then(data =>{
      const TutorialsByAuthorArray =   document.getElementById("tutorialsByAuthor")
    const TuotorialsByAuthor = JSON.parse(data.TutorialsByAuthorData)
      TutorialBySAMEAUTHOR(TuotorialsByAuthor)
    
})


const sideTutorialContainer = document.getElementById("tutorialSideBar")

// get Tutorials of the same Category 
fetch(`/${tutorialOwnerContainer}/${tutorialCategory}/tutorialsSameCourse`, ()=> {
    method:"GET"
}).then(res => res.json())
.then(data =>{
    if(JSON.parse(data.TutorialsSameCourseData).length > 0){
      RelatedTutorials(JSON.parse(data.TutorialsSameCourseData))
    // tutoialsOfSameCourse.setAttribute("value", data.TutorialsSameCourseData)
    }else{
    // tutorialsByAuthorContainerMain.innerHTML = `<h5 class="mb-4">There are no more courses from this author</h5>`;
    // tutoialsOfSameCourse.setAttribute("value", "[]")
    sideTutorialContainer.innerHTML = ""


    }
})



function RelatedTutorials(TutorialsSameCategory) {
    // console.log(TutorialsSameCategory)
    TutorialsSameCategory.forEach(sameCourseElement => {

        const tutorialTitle = sameCourseElement.tutorial_title
        const tutorialCourse = sameCourseElement.related_course_id
        const tutorialId = sameCourseElement.tutorial_id
        const tutorialCategory = sameCourseElement.tutorial_category
        const tutorialDate = formatDateAgo(sameCourseElement.date_uploaded)
        const tutorialDuraiton = ConvertToMinutes(sameCourseElement.video_duration)
        const TutorialThumbnail = sameCourseElement.tutorial_thumbnail
        const tutorialDescription = sameCourseElement.tutorial_description
        const OwnerFirstname = sameCourseElement.first_name
        const OwnerLastname = sameCourseElement.last_name
        const Owner = sameCourseElement.username
        const OwenrProfilePicture = sameCourseElement.profile_picture


   
        sideTutorialContainer.innerHTML += `<div class="col-sm-6 col-xl-12">
<div class="card shadow h-100">
    <div class="cover card-img-top" style="background-image:url(/userUploads/thumbnails/${TutorialThumbnail}); background-size: cover;background-repeat: no-repeat;">

        <div class="overlay">
         <div class="player">
             <a href="/c${tutorialCourse}/cst${tutorialId}">  <i class="fa fa-play"></i>  </a>
         </div>
   
        </div> 
 </div>
    
    <!-- Card body -->
    <div class="card-body pb-0">
        <!-- Badge and favorite -->
        <div class="d-flex justify-content-between mb-2">
          
        </div>
        <!-- Title -->
        <h5 class="card-title"><a href="#">${tutorialTitle}</a></h5>
        <p class="mb-2 text-truncate-2">${tutorialDescription}</p>
        <!-- Rating star -->
  
    </div>
    <!-- Card footer -->
    <div class="card-footer pt-0 pb-3">
        <hr>
        <div class="d-flex justify-content-between">
            <span class="h6 fw-light mb-0"><i class="far fa-clock text-danger me-2"></i>
            ${tutorialDuraiton}</span>
            <span class="h6 fw-light mb-0"><i class="fas fa-table text-orange me-2"></i>15 lectures</span>
        </div>
        <div class="creator bud">
            <div class="first_name">
                <div class="profile_container bg-golden-yellow">
                <img src="/userUploads/profileimages/${OwenrProfilePicture}" alt="container">
            </div>
            <a href="/@${Owner}"><div class="name">${OwnerFirstname} ${OwnerLastname}</div>
            </div>
            <span>
                | ${tutorialDate}
            </span></a>
        </div>
    </div>
</div>
</div>
`;
    })

}

    


// ...GET THE TUROTIALS FROM THE SAME AUTHOR 

const TutorialsFromSameAuthor_array = document.getElementById("tutorialsByAuthor")
function TutorialBySAMEAUTHOR(TuotorialsByAuthor){
if(TuotorialsByAuthor.length > 0){
    TuotorialsByAuthor.forEach(tutorial =>{
        const TutorialTitle = tutorial.tutorial_title
        const Description = tutorial.tutorial_description
        const Duration = ConvertToMinutes(tutorial.video_duration)
        const Date = tutorial.date_uploaded
        const AuthorCourse = tutorial.related_course_id
        const Id = tutorial.tutorial_id
        const Category = tutorial.category
        const thumbnail = tutorial.tutorial_thumbnail
        const video = tutorial.tutorial_video
        const TutorialOwner = tutorial.tutorial_owner

        AuthorTutorialContainer.innerHTML += `
         <div class="d-sm-flex justify-content-sm-between align-items-center">
        <div class="d-flex">
            <a href="/${TutorialOwner}/${AuthorCourse}/${Id}" class="btn btn-danger-soft btn-round mb-0 flex-shrink-0"><i class="fas fa-play"></i></a>
            <div class="ms-2 ms-sm-3 mt-1 mt-sm-0">	
                <h6 class="mb-0">${TutorialTitle}</h6>
                <p class="mb-2 mb-sm-0 small">${Duration}</p>
            </div>
        </div>

        <a href="/${TutorialOwner}/${AuthorCourse}/${Id}" class="btn btn-sm btn-success mb-0">Play</a>
        </div>
        
        <hr>
        `


    })




}else{
    AuthorTutorialContainer.innerHTML += `
    <div>
    Nothing to Display yet
    </div>`
}
}