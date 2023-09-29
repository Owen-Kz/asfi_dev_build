
const TutorialsContainer_ = document.getElementById("TutorialsContainer")

const limitedTextElements_ = document.getElementsByClassName("limited-text")
const maxLength_ = 50; // Maximum number of characters
// COnvert Video Duration to minutes 
function ConvertToMinutes(secondsProvided, ParentElement){
    // Define the total seconds
var totalSeconds = secondsProvided;

// Calculate hours, minutes, and seconds
var hours = Math.floor(totalSeconds / 3600);
var minutes = Math.floor((totalSeconds % 3600) / 60);
var seconds = Math.round(totalSeconds % 60);

// Create strings with appropriate prefixes
var hoursStr = hours > 0 ? hours + " hr" + (hours > 1 ? "s" : "") : "";
var minutesStr = minutes > 0 ? minutes + " min" + (minutes > 1 ? "s" : "") : "";
var secondsStr = seconds > 0 ? seconds + " sec" + (seconds > 1 ? "s" : "") : "";

// Combine the time components
const result = [hoursStr, minutesStr, secondsStr].filter(Boolean).join(" ");
ParentElement.innerText = result
}




// Convert UPload date to Days Ago 
function formatDateAgo(dateString) {
    const inputDate = new Date(dateString); // Parse the input date string
    const currentDate = new Date(); // Get the current date

    // Calculate the time difference in milliseconds
    const timeDifference = currentDate - inputDate;
  
    // Calculate the number of days ago
    const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  
    if (daysAgo === 0) {
      return "Today";
    } else if (daysAgo === 1) {
      return "Yesterday";
    } else if(daysAgo > 365){
        return "1 year ago"
    }
    else {
      return daysAgo + " Days Ago";
    }
  }

function updateUIFilter(TutorialArray){
TutorialsContainer_.innerHTML = ""
if(TutorialArray.length > 0 ){
TutorialArray.forEach(tutorial => {
    const TutorialName = tutorial.tutorial_title
    const Tutorialid = tutorial.tutorial_id
    const CourseId = tutorial.related_course_id
    const TutorialOwner = tutorial.tutorial_owner
    const TutorialDuration_ = tutorial.video_duration
    const TutorialDescription = tutorial.tutorial_description
    const TutorialThumbnailMain = tutorial.tutorial_thumbnail
    const TutorialOwnerFullName = tutorial.OwnerFullname
    const CourseLevel = tutorial.CourseLevel
    const TutorialOwnerProfilePicture_main = tutorial.OwnerProfilePicture

    const userProfileImages = []

    if(TutorialOwnerProfilePicture_main == "avatar.jpg"){
    const TutorialOwnerProfilePicture = `https://eu.ui-avatars.com/api/?background=random&name=${TutorialOwnerFullName}&font-size=0.5&rounded=true&size=128&background=333333&color=ffffff`
    userProfileImages.push(TutorialOwnerProfilePicture)
    }else{
    const TutorialOwnerProfilePicture = `/userUploads/profileImages/${TutorialOwnerProfilePicture_main}`;
    userProfileImages.push(TutorialOwnerProfilePicture)
    }

    const TutorialDate = tutorial.date_uploaded
    const TotalRelatedTutorials = tutorial.CourseCount
    const TotalPrefixArray = []

  const formattedDate = formatDateAgo(TutorialDate);
  if(TotalRelatedTutorials > 1){
    const TotalPrefix = "lectures"
    TotalPrefixArray.push(TotalPrefix)
  }else{
    const TotalPrefix = "lecture"
    TotalPrefixArray.push(TotalPrefix)
  }
    if (CourseId == "rtuT3g") {
        TutorialsContainer.innerHTML += `<div class="col-sm-6 col-xl-4">
    <div class="card shadow h-100">
        <div class="cover card-img-top" style="background-image:url(/userUploads/thumbnails/${TutorialThumbnailMain}); background-size: cover;background-repeat: no-repeat;">

            <div class="overlay">
             <div class="player">
                 <a href="/${TutorialOwner}/${CourseId}/${Tutorialid}">  <i class="fa fa-play"></i>  </a>
             </div>
       
            </div> 
     </div>
        
        <!-- Card body -->
        <div class="card-body pb-0">
            <!-- Badge and favorite -->
            <div class="d-flex justify-content-between mb-2">
          
            </div>
            <!-- Title -->
            <h5 class="card-title"><a href="/${TutorialOwner}/${CourseId}/${Tutorialid}">${TutorialName}</a></h5>
            <p class="mb-2 text-truncate-2">${TutorialDescription}</p>
            <!-- Rating star -->
       
        </div>
        <!-- Card footer -->
        <div class="card-footer pt-0 pb-3">
            <hr>
            <div class="d-flex justify-content-between">
                <span class="h6 fw-light mb-0"><i class="far fa-clock text-danger me-2" id=${TutorialDuration_+Tutorialid}></i></span>
            </div>
            <div class="creator bud">
                <div class="first_name">
                    <div class="profile_container bg-golden-yellow">
                    <img src="${userProfileImages[0]}" alt="container">
                </div>
                <a href="/@${TutorialOwner}"><div class="name">${TutorialOwnerFullName}</div>
                </div>
                <span>
                    | ${formattedDate}
                </span></a>
            </div>
        </div>
    </div>
</div>`;

const ParentForTime = document.getElementById(TutorialDuration_+Tutorialid)
ConvertToMinutes(TutorialDuration_, ParentForTime)
    } else {
        TutorialsContainer.innerHTML += ` <div class="col-sm-6 col-xl-4">
        <div class="card shadow h-100">
            <div class="cover card-img-top" style="background-image:url(/userUploads/thumbnails/${TutorialThumbnailMain}); background-size: cover;background-repeat: no-repeat;">
    
                <div class="overlay">
                 <div class="player">
                     <a href="/${TutorialOwner}/${CourseId}/${Tutorialid}">  <i class="fa fa-play"></i>  </a>
                 </div>
           
                </div> 
         </div>
            
            <!-- Card body -->
            <div class="card-body pb-0">
                <!-- Badge and favorite -->
                <div class="d-flex justify-content-between mb-2">
                    <a href="#" class="badge bg-purple bg-opacity-10 text-purple">${CourseLevel}</a>
                    <a href="#" class="h6 fw-light mb-0"><i class="far fa-heart"></i></a>
                </div>
                <!-- Title -->
                <h5 class="card-title"><a href="/${TutorialOwner}/${CourseId}/${Tutorialid}">${TutorialName}</a></h5>
                <p class="mb-2 text-truncate-2 limited-text">${TutorialDescription}</p>
                <!-- Rating star -->
                <ul class="list-inline mb-0">
                    <li class="list-inline-item me-0 small"><i class="fas fa-star text-warning"></i></li>
                    <li class="list-inline-item me-0 small"><i class="fas fa-star text-warning"></i></li>
                    <li class="list-inline-item me-0 small"><i class="fas fa-star text-warning"></i></li>
                    <li class="list-inline-item me-0 small"><i class="fas fa-star text-warning"></i></li>
                    <li class="list-inline-item me-0 small"><i class="far fa-star text-warning"></i></li>
                    <li class="list-inline-item ms-2 h6 fw-light mb-0">4.0/5.0</li>
                </ul>
            </div>
            <!-- Card footer -->
            <div class="card-footer pt-0 pb-3">
                <hr>
                <div class="d-flex justify-content-between">
                    <span class="h6 fw-light mb-0"><i class="far fa-clock text-danger me-2" id="${TutorialDuration_+Tutorialid}"></i></span>
                    <span class="h6 fw-light mb-0"><i class="fas fa-table text-orange me-2"></i>${TotalRelatedTutorials} ${TotalPrefixArray[0]}</span>
                </div>
                <div class="creator bud">
                    <div class="first_name">
                        <div class="profile_container bg-golden-yellow">
                        <img src="${userProfileImages[0]}" alt="container">
                    </div>
                    <a href="/@${TutorialOwner}"><div class="name">${TutorialOwnerFullName}</div>
                    </div>
                    <span>
                        | ${formattedDate}
                    </span></a>
                </div>
            </div>
        </div>
    </div>`;

    
    const ParentForTime = document.getElementById(TutorialDuration_+Tutorialid)
    ConvertToMinutes(TutorialDuration_, ParentForTime)
    
    }
});



// Loop through each element and truncate if necessary
if(limitedTextElements){
for (var i = 0; i < limitedTextElements.length; i++) {
    var limitedText = limitedTextElements[i];
    if (limitedText.textContent.length > maxLength_) {
        limitedText.textContent = limitedText.textContent.substring(0, maxLength_) + "...";
    }
}
}
}else{
    TutorialsContainer.innerHTML = `    <div class="no_content_message">
    <svg class="icon icon-no_sim"><use xlink:href="#icon-no_sim"></use>
  
      <symbol id="icon-no_sim" viewBox="0 0 24 24">
          <path d="M3.656 3.891l17.484 17.438-1.313 1.313-1.875-1.922q-0.563 0.281-0.938 0.281h-10.031q-0.797 0-1.383-0.609t-0.586-1.406v-11.203l-2.625-2.625zM18.984 5.016v11.672l-11.344-11.344 2.344-2.344h7.031q0.797 0 1.383 0.609t0.586 1.406z"></path>
  </symbol>
</svg>              
      <span class="text">Nothing matches your query</span>
  </div>`
}
}

