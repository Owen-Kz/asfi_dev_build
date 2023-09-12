const container = document.querySelector(".video_container"),
    // blurvid = document.querySelector("video"),
    mainVideo = container.querySelector("video"),
    videoTimeline = container.querySelector(".video-timeline"),
    progressBar = container.querySelector(".progress-bar"),
    volumeBtn = container.querySelector(".volume i"),
    volumeSlider = container.querySelector(".left input"),
currentVidTime = container.querySelector(".current-time"),
    videoDuration = container.querySelector(".video-duration"),
    skipBackward = container.querySelector(".skip-backward i"),
    skipForward = container.querySelector(".skip-forward i"),
    playPauseBtn = container.querySelector(".play-pause i"),
    speedBtn = container.querySelector(".playback-speed span"),
    speedOptions = container.querySelector(".speed-options"),
    fullScreenBtn = container.querySelector(".fullscreen i");
let timer;
const AuthorTutorialContainer = document.getElementById("tutorialsByAuthorContainerMain")


const hideControls = () => {
    if (mainVideo.paused) return;
    timer = setTimeout(() => {
        container.classList.remove("show-controls");
    }, 3000);
}
hideControls();
// blurvid.volume = 0;
container.addEventListener("mousemove", () => {
    container.classList.add("show-controls");
    clearTimeout(timer);
    hideControls();
});

const formatTime = time => {
    let seconds = Math.floor(time % 60),
        minutes = Math.floor(time / 60) % 60,
        hours = Math.floor(time / 3600);

    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;

    if (hours == 0) {
        return `${minutes}:${seconds}`
    }
    return `${hours}:${minutes}:${seconds}`;
}

videoTimeline.addEventListener("mousemove", e => {
    let timelineWidth = videoTimeline.clientWidth;
    let offsetX = e.offsetX;
    let percent = Math.floor((offsetX / timelineWidth) * mainVideo.duration);
    const progressTime = videoTimeline.querySelector("span");
    offsetX = offsetX < 20 ? 20 : (offsetX > timelineWidth - 20) ? timelineWidth - 20 : offsetX;
    progressTime.style.left = `${offsetX}px`;
    progressTime.innerText = formatTime(percent);
});

videoTimeline.addEventListener("click", e => {
    let timelineWidth = videoTimeline.clientWidth;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
    // blurvid.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
});

mainVideo.addEventListener("timeupdate", e => {
    let { currentTime, duration } = e.target;
    let percent = (currentTime / duration) * 100;
    progressBar.style.width = `${percent}%`;
    currentVidTime.innerText = formatTime(currentTime);
});

mainVideo.addEventListener("loadeddata", () => {
    videoDuration.innerText = formatTime(mainVideo.duration);
});

const draggableProgressBar = e => {
    let timelineWidth = videoTimeline.clientWidth;
    progressBar.style.width = `${e.offsetX}px`;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
    // blurvid.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
    currentVidTime.innerText = formatTime(mainVideo.currentTime);
}

volumeBtn.addEventListener("click", () => {
    if (!volumeBtn.classList.contains("fa-volume-high")) {
        mainVideo.volume = 0.5;
        volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
    } else {
        mainVideo.volume = 0.0;
        volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
    }
    volumeSlider.value = mainVideo.volume;
});

volumeSlider.addEventListener("input", e => {
    mainVideo.volume = e.target.value;
    if (e.target.value == 0) {
        return volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
    }
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
});

speedOptions.querySelectorAll("li").forEach(option => {
    option.addEventListener("click", () => {
        mainVideo.playbackRate = option.dataset.speed;
        // blurvid.playbackRate = option.dataset.speed;
        speedOptions.querySelector(".active").classList.remove("active");
        option.classList.add("active");
    });
});

document.addEventListener("click", e => {
    if (e.target.tagName !== "SPAN" || e.target.className !== "material-symbols-rounded") {
        speedOptions.classList.remove("show");
    }
});

fullScreenBtn.addEventListener("click", () => {
    container.classList.toggle("fullscreen");
    if (document.fullscreenElement) {
        fullScreenBtn.classList.replace("fa-compress", "fa-expand");
        return document.exitFullscreen();
    }
    fullScreenBtn.classList.replace("fa-expand", "fa-compress");
    container.requestFullscreen();
});

speedBtn.addEventListener("click", () => speedOptions.classList.toggle("show"));
skipBackward.addEventListener("click", () => { mainVideo.currentTime -= 5 });
skipForward.addEventListener("click", () => { mainVideo.currentTime += 5 });
mainVideo.addEventListener("play", () => playPauseBtn.classList.replace("fa-play", "fa-pause"));
mainVideo.addEventListener("pause", () => playPauseBtn.classList.replace("fa-pause", "fa-play"));
playPauseBtn.addEventListener("click", () => { mainVideo.paused ? mainVideo.play() : mainVideo.pause() });
videoTimeline.addEventListener("mousedown", () => videoTimeline.addEventListener("mousemove", draggableProgressBar));
document.addEventListener("mouseup", () => videoTimeline.removeEventListener("mousemove", draggableProgressBar));



// FORMAT THE DESCRIPTION TEXTS 
var limitedTextElements = document.getElementById("courseDescription")
const maxLength = 100

// for (var i = 0; i < limitedTextElements.length; i++) {
// var limitedText = limitedTextElements;
collapseContent.innerText = limitedTextElements.innerText.substring(maxLength,limitedTextElements.innerText.length)

if (limitedTextElements.innerText.length > maxLength) {
    limitedTextElements.innerText = limitedTextElements.innerText.substring(0, maxLength) + "...";
}

// // }

// expandDescription.addEventListener("click", function () {
//     // console.log("CS")
//     limitedTextElements.innerText = limitedTextElements.innerText.substring(0, limitedTextElements.innerText.length);

// })




// DateConverison script 
import { ConvertToMinutes , formatDateAgo} from "./dateConverter.js";

// convertDate()

//Append Tutorials to the side bar
const TutorialsSameCategoryArray = document.getElementById("tutorialsInCategory").value
const TutorialsSameCategory = JSON.parse(TutorialsSameCategoryArray)

const sideTutorialContainer = document.getElementById("tutorialSideBar")


if (TutorialsSameCategory.length > 0) {
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
            <a href="#" class="badge bg-purple bg-opacity-10 text-purple">All level</a>
            <a href="#" class="h6 fw-light mb-0"><i class="far fa-heart"></i></a>
        </div>
        <!-- Title -->
        <h5 class="card-title"><a href="#">${tutorialTitle}</a></h5>
        <p class="mb-2 text-truncate-2">${tutorialDescription}</p>
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

const TutorialsFromSameAuthor_array = document.getElementById("tutorialsByAuthor").value
const TuotorialsByAuthor = JSON.parse(TutorialsFromSameAuthor_array)

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