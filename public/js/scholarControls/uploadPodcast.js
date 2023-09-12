const PodcastForm = document.getElementById("podcast")

genBuffer()
// GENERATE RANDOM ID TO AD TO PODCAST SERACH QUERY 
function genBuffer() {
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
var passwordLength = 24;
var bufferID  = "";
for (var i = 0; i <= passwordLength; i++) {
var randomNumber = Math.floor(Math.random() * chars.length);
bufferID += chars.substring(randomNumber, randomNumber +1);
}
PodcastForm.querySelector(".buffer").value = bufferID
}


const FILE = document.getElementById("file_audio")

    // module.exports = register;
    $(".submitPodcastM").css("display", "none");

    
    $("#submitPodcast").on("click", function(){

        if(FILE.files[0]){
        const FILE_SIZE = FILE.files[0].size
        const FILE_TYPE = FILE.files[0].type

        // console.log(FILE_TYPE)

        if(FILE_SIZE > 1000000000){
            $("#warning").text("File Size greater than 1GB")
        }
        if(FILE_TYPE !== "audio/mpeg" && FILE_TYPE !== "audio/wav"){
            $("#warning").text("invalid File format Choose an mp3 file")
        }

        if(FILE_SIZE < 1000000000 && (FILE_TYPE == "audio/mpeg" || FILE_TYPE == "audio/wav")){
            $(".submitPodcastM").trigger("click")
        }
    }
    
    else{
       $("#warning").text("No File Received")
       }
    })


    // GET AND DISPLAY PODCAST MODAL 
    var PodcastModal = document.getElementById("PodcastUploadModal");

var Podcastbtn = document.getElementById("PodcastUploadBtn");

var PodcastSpan = document.getElementsByClassName("pdclose")[0];

Podcastbtn.onclick = function() {
    PodcastModal.style.display = "flex";
}
PodcastSpan.onclick = function() {
  PodcastModal.style.display = "none";
}
window.addEventListener = function(event) {
  if (event.target == PodcastModal) {
    PodcastModal.style.display = "none";
}
}