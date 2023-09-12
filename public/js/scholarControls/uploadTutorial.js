var TutorialModal = document.getElementById("TutorialUploadModal");

var Tutorialbtn = document.getElementById("TutorialUploadBtn");

var TutorialSpan = document.getElementsByClassName("tutclose")[0];

Tutorialbtn.onclick = function() {
    TutorialModal.style.display = "flex";
}
TutorialSpan.onclick = function() {
  TutorialModal.style.display = "none";
}

window.addEventListener = function(event) {
    if (event.target == TutorialModal) {
      TutorialModal.style.display = "none";
    }
}



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
document.getElementById("buffer").value = bufferID 
}
const Errors = []
const VIDEO_FILE = document.getElementById("file")
const IMG_FILE = document.getElementById("file")
    // module.exports = register;
    $(".submitBookM").css("display", "none");

    $("#submitBook").on("click", function(){
        if(FILE.files[0]){

        const FILE_SIZE = FILE.files[0].size
        const FILE_TYPE = FILE.files[0].type

        if(FILE_SIZE > 1000000000){
            $("#warning").text("File Size greater than 1GB")
            Errors.push("LARGE_VIDEO_FILE")
        }
        if(FILE_TYPE !== "video/*"){
            $("#warning").text("invalid File format Choose an mp3 file")
            Errors.push("LARGE_VIDEO_FILE")
        }
        if(FILE_SIZE < 1000000000 && (FILE_TYPE == "video/*")){
            $(".submitBookM").trigger("click")
        }
     }
    
     else{
        $("#warning").text("No File Received")
        }
    })

    // if(FILE[0]){
    //     if(Errors.length > 0){
    //         uploadTutorialForm.addEventListener("submit", () =>{
    //             const login = {
    //                 user: user.value,
    //                 pass: pass.value
    //             }
    //             fetch("/api/scholar/createTutorial", {
    //                 method: "POST",
    //                 body: JSON.stringify(login),
    //                 headers: { 
    //                     "Content-type" : "application/JSON"
    //                 }
    //             }).then(res => res.json())
    //             .then(data => {
    //                 if(data.status == "error") {
    //                     success.style.visibility = "hidden";
    //                     success.style.contentVisibility = "hidden";
    //                     error.style.visibility = "visible";
    //                     error.style.opacity  = "1";
    //                     error.style.contentVisibility = "visible";
    //                     error.style.marginTop = "0px";
    //                     success.style.marginTop = "20px";
    //                     error.innerText = data.error;
    //                 }
    //                 else{
    //                     error.style.visibility = "hidden";
    //                     error.style.contentVisibility = "hidden";
    //                     success.style.visibility = "visible";
    //                     success.style.opacity  = "1";
    //                     success.style.contentVisibility = "visible";
    //                     success.style.marginTop = "0px";
    //                     error.style.marginTop = "-20px";
    //                     success.innerText = data.success;
    //                     window.location.href = "/dashboard";
            
    //                 }
    //                 })
    //             })

    //     }
    // }