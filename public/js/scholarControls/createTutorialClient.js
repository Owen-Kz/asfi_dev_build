const TutorialForm = document.getElementById("uploadTutorialForm")


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
    TutorialForm.querySelector("#buffer").value = bufferID
}

function genCommentBuffer() {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var passwordLength = 10;
    var bufferID = "";
    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        bufferID += chars.substring(randomNumber, randomNumber + 1);
    }
    TutorialForm.querySelector("#commentBuffer").value = "CC_" + bufferID
}

function genTutorialBuffer() {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var passwordLength = 10;
    var bufferID = "";
    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        bufferID += chars.substring(randomNumber, randomNumber + 1);
    }
    TutorialForm.querySelector("#tutorialBuffer").value = "TT_" + bufferID
}
const errors_tuts = []
const ImageFileFormat = ["image/png", "image/jpeg", "images.jpg"]
const VideoFileFormat = ["video/mp4", "video/3gp"]
const VIDEO_FILE_TUTS = TutorialForm.querySelector("#video")
const IMG_FILE_TUTS = TutorialForm.querySelector("#thumbnail")

// module.exports = register;
// $(".submitBookM").css("display", "none");

$("#createNew_Tutorial").on("click", function () {
    

    // if (VIDEO_FILE_TUTS.files[0]) {

    //     const VIDEO_FILE_TUTS_SIZE = VIDEO_FILE_TUTS.files[0].size
    //     const VIDEO_FILE_TUTS_TYPE = VIDEO_FILE_TUTS.files[0].type

    //     const thumnail_FILE_SIZE = IMG_FILE_TUTS.files[0].size
    //     const thumnail_FILE_TYPE = IMG_FILE_TUTS.files[0].type

    //     if (VIDEO_FILE_TUTS_SIZE > 1000000000) {
    //         // $("#warning").text("File Size greater than 1GB")
    //         errors_tuts.push("LARGE_VIDEO_FILE_TUTS")
    //     }
    //     if (!VideoFileFormat.includes(VIDEO_FILE_TUTS_TYPE)) {
    //         console.log("invalid File format Choose an mp4 file")
    //         errors_tuts.push("INVALID_VIDEO_FILE_TUTS_TYPE")
    //     }
    //     if (thumnail_FILE_SIZE > 20000000) {
    //         errors_tuts.push("LARGE_THUMBNAIL_FILE")
    //     }

    //     if (!ImageFileFormat.includes(thumnail_FILE_TYPE)) {
    //         errors_tuts.push("INVALID_FILE_TYPE")
    //         console.log("Invalid File thumbnail format")
    //     }


    //     if (VIDEO_FILE_TUTS_SIZE < 1000000000 && VideoFileFormat.includes(VIDEO_FILE_TUTS_TYPE) && thumnail_FILE_SIZE < 20000000 && ImageFileFormat.includes(thumnail_FILE_TYPE)) {
            errors_tuts.length = 0

            console.log(errors_tuts)
            if (errors_tuts.length == 0) {
                $("#create_TUTORIAL").trigger("click")
            }
    //     }
    // }
    // else {
    //     // $("#warning").text("No File Received")
    //     console.log("No File Received")
    // }
})
