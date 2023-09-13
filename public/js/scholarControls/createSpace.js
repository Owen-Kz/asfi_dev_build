var SpaceModal = document.getElementById("CreateSpaceModal");

var Spacebtn = document.getElementById("CreateSpaceBtn");

var SpaceSpan = document.getElementsByClassName("tutclose")[0];

Spacebtn.onclick = function() {
    SpaceModal.style.display = "flex";
}
SpaceSpan.onclick = function() {
  SpaceModal.style.display = "none";
}

window.addEventListener = function(event) {
    if (event.target == SpaceModal) {
      SpaceModal.style.display = "none";
    }
  }


genSpaceBuffer()

// GENERATE RANDOM ID
function genSpaceBuffer() {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var passwordLength = 24;
  var bufferID = "";
  for (var i = 0; i <= passwordLength; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length);
      bufferID += chars.substring(randomNumber, randomNumber + 1);
  }
  document.getElementById("bufferSpace").value = bufferID
}




  // HANDLE THE FROM SUBMISSION AND SPACE CONTENT 

const thumbnail = document.getElementById("thumbnail")
const createNew_Space = document.getElementById("createNew_space")
const shortDescription = document.getElementById("shortDescription")
const spaceTitle = document.getElementById("spaceTitle")


createNew_Space.addEventListener("click", function(){

if(thumbnail.files[0]){
const FILE_SIZE = thumbnail.files[0].size
const FILE_TYPE = thumbnail.files[0].type

if(FILE_SIZE > 1000000000){
    alert("File is too Large")
 
}
if(FILE_TYPE !== "image/png" && FILE_TYPE !== "image/jpeg" && FILE_TYPE !== "image/jpg"){
    var parentDiv = document.getElementById("BookUploadModal")
    alert("File is Not an image")
}
if(FILE_SIZE < 1000000000 && (FILE_TYPE == "image/png" || FILE_TYPE == "image/jpeg" || FILE_TYPE == "image/jpg")){
 $("#create_SPACE").trigger("click")
}
}
})



space.addEventListener("submit", (e)=>{
  e.preventDefault();
  const NewSpaceData = {
    spaceTitle:spaceTitle.value,
    shortDescription: shortDescription.value,
    Buffer:bufferSpace.value,
    thumbnail: thumbnail.files[0]
  }
  fetch("/createSpaces", {
    method:"POST",
    headers:{
      "Content-type" : "application/JSON"
    }
  }).then(res => res.json())
  .then(data => {
     alert(data.message)
     window.location.href = '/directory'
  })
})


