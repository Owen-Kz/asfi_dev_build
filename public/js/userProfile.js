// Open up device storage to choose photo 
// GENERATE RANDOM ID TO AD TO PODCAST SERACH QUERY 
var Imageform = document.getElementById("image_form")


const usernameContainer = document.getElementById("usernameContainer")

genBuffer()

function genBuffer() {
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
var passwordLength = 24;
var bufferID  = "";
for (var i = 0; i <= passwordLength; i++) {
var randomNumber = Math.floor(Math.random() * chars.length);
bufferID += chars.substring(randomNumber, randomNumber +1);
}
// console.log(bufferID)
$("body").prepend(`<input type='text' value='' id='bufferContainer' hidden readonly/>`)

const bufferContainer  = document.getElementById('bufferContainer')
bufferContainer.value = bufferID

}


// Edit Profie Image

$(".edit-image").on("click", function(){
    const bufferID_main = bufferContainer.value
    // console.log(bufferID_main)

    if($("#image_form").length > 0){
        $("#image_form").remove()
    }
    else
    {
 
        $("body").prepend(`<form enctype='multipart/form-data' method='POST' action='/profilePhoto/u' style='display:none' id='image_form'>\
        <input type='text' name='bufferImage' id='bufferImage' value=${bufferID_main} readonly>\
        <input type='file' name='profileImage' id='profileImage' onchange='checkImageCHange()' accept='.jpg, .jpeg, .png'>\
    </form>`)


    $("#profileImage").click()

}
})
    // find the image file 
    function checkImageCHange(){
    const FILE_Profile_image= document.getElementById("profileImage")
        const FILE_SIZE_Profile_image = FILE_Profile_image.files[0].size
        const FILE_TYPE_Profile_image = FILE_Profile_image.files[0].type

        if(FILE_SIZE_Profile_image > 10000000){
            alert("File is too large")
        }
        if(FILE_TYPE_Profile_image !== "image/png" && FILE_TYPE_Profile_image !== "image/jpeg" && FILE_TYPE_Profile_image !== "image/jpg"){
            alert("invalid File format Choose an image file")
        }
        // console.log(document.getElementById("bufferImage").value)
     
        if(FILE_SIZE_Profile_image < 10000000 && (FILE_TYPE_Profile_image == "image/png" || FILE_TYPE_Profile_image == "image/jpg" || FILE_TYPE_Profile_image == "image/jpeg")){
                uploadImageFunctionProfile()
                console.log("FileUPloaded Perhaps")
        }
}

// Submit the new image 
function uploadImageFunctionProfile(){
    console.log("This happend")
    $("#image_form").trigger("submit");
}


// REMOVE READONLY attributes and Edit the Profile 
$(".profile-edit-btn").on("click", function(){
    if($(".submit-button-container").length > 0){
        $(".submit-button-container").remove()
        $(".profile_input_field").attr("readonly", "true")
    }
    else{
        $(".profile_input_field").removeAttr("readonly")

        $("#submit-panel").append("\
        <div class='submit-button-container'>\
            <button>Submit</button>\
        </div>\
        ")
    }
  })


// Edit Cover Image

$(".edit-cover").on("click", function(){
    const bufferID_main = bufferContainer.value
    const username = usernameContainer.value

    // console.log(bufferID_main)

    // if($("#cover_form").length > 0){
    //     $("#cover_form").remove()
    // }
    // else{
        {
 
        $("body").prepend(`<form enctype='multipart/form-data' action='/coverImage' method='POST' style='display:none' id='cover_form'>\
        <input type='text' name='username' id='username' value='${username}'>\
        <input type='text' name='bufferCover' id='bufferCover' value='${bufferID_main}' readonly>\
        <input type='file' name='profileCover' id='profileCover' onchange='checkCoverCHange()' accept='.jpg, .jpeg, .png'>\
    </form>`)


    $("#profileCover").click()

}
})
    // find the image file 
    function checkCoverCHange(){
    const FILE = document.getElementById("profileCover")
        const FILE_SIZE = FILE.files[0].size
        const FILE_TYPE = FILE.files[0].type

        if(FILE_SIZE > 10000000){
            alert("File is too large")
        }
        if(FILE_TYPE !== "image/png" && FILE_TYPE !== "image/jpeg" && FILE_TYPE !== "image/jpg"){
            alert("invalid File format Choose an image file")
        }

     
            if(FILE_SIZE < 10000000 && (FILE_TYPE == "image/png" || FILE_TYPE == "image/jpg" || FILE_TYPE == "image/jpeg")){
                uploadImageFunction()
            }
}

// Submit the new image 
function uploadImageFunction(){
    $("#cover_form").trigger("submit");
}

