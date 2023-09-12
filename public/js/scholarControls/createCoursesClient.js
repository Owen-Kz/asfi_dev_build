genBuffer()
genCommentBuffer()
genTutorialBuffer()

// GENERATE RANDOM ID TO AD TO PODCAST SERACH QUERY 
function genBuffer() {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var passwordLength = 24;
    var bufferID = "";
    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        bufferID += chars.substring(randomNumber, randomNumber + 1);
    }
    document.getElementById("buffer").value = bufferID
}
 
function genCommentBuffer() {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var passwordLength = 10;
    var bufferID = "";
    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        bufferID += chars.substring(randomNumber, randomNumber + 1);
    }
    document.getElementById("commentBuffer").value = "CC_" + bufferID
}

function genTutorialBuffer() {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var passwordLength = 10;
    var bufferID = "";
    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        bufferID += chars.substring(randomNumber, randomNumber + 1);
    }
    document.getElementById("tutorialBuffer").value = "TT_" + bufferID
}
const Errors = []
const ImageFileFormat = ["image/png", "image/jpeg", "images.jpg"]
const VideoFileFormat = ["video/mp4", "video/3gp"]
const VIDEO_FILE = document.getElementById("video")
const IMG_FILE = document.getElementById("thumbnail")

// module.exports = register;
// $(".submitBookM").css("display", "none");

$("#createNewCourses").on("click", function () {


    if (VIDEO_FILE.files[0]) {

        const video_FILE_SIZE = VIDEO_FILE.files[0].size
        const video_FILE_TYPE = VIDEO_FILE.files[0].type

        const thumnail_FILE_SIZE = IMG_FILE.files[0].size
        const thumnail_FILE_TYPE = IMG_FILE.files[0].type

        if (video_FILE_SIZE > 1000000000) {
            // $("#warning").text("File Size greater than 1GB")
            Errors.push("LARGE_VIDEO_FILE")
        }
        if (!VideoFileFormat.includes(video_FILE_TYPE)) {
            console.log("invalid File format Choose an mp4 file")
            Errors.push("INVALID_VIDEO_FILE_TYPE")
        }
        if (thumnail_FILE_SIZE > 20000000) {
            Errors.push("LARGE_THUMBNAIL_FILE")
        }

        if (!ImageFileFormat.includes(thumnail_FILE_TYPE)) {
            Errors.push("INVALID_FILE_TYPE")
            console.log("Invalid File thumbnail format")
        }


        if (video_FILE_SIZE < 1000000000 && VideoFileFormat.includes(video_FILE_TYPE) && thumnail_FILE_SIZE < 20000000 && ImageFileFormat.includes(thumnail_FILE_TYPE)) {
            Errors.length = 0

            console.log(Errors.length)
            if (Errors.length == 0) {
                $("#createNEW_TUTORIAL").trigger("click")
            }
        }
    }
    else {
        // $("#warning").text("No File Received")
        console.log("No File Received")
    }
})

$("#createNEW_TUTORIAL").on("click", function(){
    console.log("Form Submitted")
})
