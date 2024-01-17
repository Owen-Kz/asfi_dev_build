const BookForm = document.getElementById("book");

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
BookForm.querySelector("#bufferBook").value = bufferID 
}
const FILE_BOOK = BookForm.querySelector("#file_pdf")

const ERRORS_ARRAY = []
const SUCCESS = []

function createWarning(WarningDetails, warningAction){
    const WARNING_DIALOG = document.createElement("div")
    WARNING_DIALOG.setAttribute("class", "input-group mb-3 upload_warning")
    WARNING_DIALOG.setAttribute("id","warning")
    // warningDiv = document.getElementById("warning") 
    WARNING_DIALOG.appendChild(document.createTextNode(WarningDetails))

    warningAction.appendChild(WARNING_DIALOG)

}

// Change the form content 
const HasLink = document.getElementById("HasLink");
const HasBook = document.getElementById("HasBook");
const HasBook_Header =  document.getElementById("HasBook_Header")
const HasLink_Header = document.getElementById("HasLink_Body")
const HasBook_Main = document.getElementById("HasBook_Main")
const HasLink_Main = document.getElementById("HasLink_main")
const removeImage = BookForm.querySelector("#removeImage")
const url_Link = document.getElementById("url_Link")
const url_title = document.getElementById("url_title")
const file_pdf = document.getElementById("file_pdf")

const YES_CLICK = document.getElementById("HasLicense")
const NO_CLICK = document.getElementById("NoLicense")



YES_CLICK.addEventListener("click", function(){
    clickBook()
})

NO_CLICK.addEventListener("click", function(){
    ClickLink()
})


function ClickLink(){
    HasLink.click()
}

function clickBook(){
    HasBook.click()
}


HasLink_Main.setAttribute("style", "display:none")
removeImage.setAttribute("style","display:none")

if(HasBook.hasAttribute("checked")){
DoBook()
}

// BRING BOOKUPLOAD FORM 
HasBook.addEventListener("change", function(){
    if(HasBook.checked){
       DoBook()
    }
})

// Add an event listener for when the radio button is clicked or changed
HasLink.addEventListener("change", function() {
    if (HasLink.checked) {
        DoLink()
}
});


// GET LINK DATA 

function DoLink(){

    HasBook_Header.setAttribute("style", "display:none;")
    HasBook_Main.setAttribute("style", "display:none")
    removeImage.setAttribute("style", "display:none")
    imagePreview.setAttribute("style", "display:none")
    file_pdf.removeAttribute("required")
    yearPublished.removeAttribute("required")
    HasLink_Main.removeAttribute("style")
    url_Link.setAttribute("required", "true")
    url_title.setAttribute("required", "true")
    if(HasLink.checked){
        $("#submitBook").on("click", function(){
        $(".submitBookM").trigger("click")
    
        })
    }
}
// GET BOOK FORM DATA 
function DoBook(){

    HasBook_Header.removeAttribute("style", "display:none;")
    HasBook_Main.removeAttribute("style", "display:none")
    removeImage.setAttribute("style", "display:none")
    imagePreview.removeAttribute("style", "display:none")
    file_pdf.setAttribute("required", true)
    yearPublished.setAttribute("required", true)
    HasLink_Main.setAttribute("style", "display:none")
    url_Link.removeAttribute("required")
    url_title.removeAttribute("required")

        // module.exports = register;
$(".submitBookM").css("display", "none");

$("#submitBook").on("click", function(){
    if(HasBook.checked){

    if(FILE_BOOK.files[0]){

    const FILE_SIZE = FILE_BOOK.files[0].size
    const FILE_TYPE = FILE_BOOK.files[0].type

    if(FILE_SIZE > 1000000000){
        var parentDiv = document.getElementById("BookUploadModal")
        createWarning("File is too Large", parentDiv)
        ERRORS_ARRAY.push("PDF_TOO_LARGE")
     
    }
    if(FILE_TYPE !== "application/pdf"){
        var parentDiv = document.getElementById("BookUploadModal")
        createWarning("File is Not a PDF", parentDiv)
        ERRORS_ARRAY.push("NOT_VALID_PDF")
    }
    if(FILE_SIZE < 1000000000 && (FILE_TYPE == "application/pdf") && yearPublished.value != ""){

        ERRORS_ARRAY.pop("NOT_PDF", "PDF_TOO_LARGE" && yearPublished.value != "")
        SUCCESS.push("PDF_FILE_IS_VALID")

     $(".submitBookM").trigger("click")

    }
}
    
 }

 else{
    $("#warning").text("No File Received")
    }
})
    }


    // 

// const imgFile = BookForm.querySelector(".image_upload_file");
const previewContainer = BookForm.querySelector("#imagePreview");
// const previewImage = BookForm.querySelector("#containerImage");
// const previewText = BookForm.querySelectorAll(".PreviewText");

// imgFile.addEventListener("change", function(){
//     removeImage.removeAttribute("style", "display:none;")

//     const FILE_BOOK_ = this.files[0];

//     if (FILE_BOOK_){
//         const FILE_BOOK_size_IMAGE = FILE_BOOK_.size
//         const FILE_BOOK_type_IMAGE = FILE_BOOK_.type
//         const reader = new FileReader();

//         containerImage.setAttribute("style", "display:block;")
//         previewText.setAttribute("style","display:none;")

//         reader.addEventListener("load", function() {

//         containerImage.setAttribute("src", this.result);
//         });

//         reader.readAsDataURL(FILE_BOOK_);

//         if(FILE_BOOK_size_IMAGE > 20000000){
//             var parentDiv = document.querySelector("#BookUploadModal")
//             createWarning("File Size greater than 20MB", parentDiv)
//             ERRORS_ARRAY.push("IMAGE_TOO_LARGE")
//         }
//         if(FILE_BOOK_type_IMAGE !== "image/jpeg" && FILE_BOOK_type_IMAGE !== "image/jpg" && FILE_BOOK_type_IMAGE !== "image/png"){
//         var parentDiv = document.querySelector("#BookUploadModal")
//         ERRORS_ARRAY.push("IMAGE_NOT_VALID")
//         createWarning("invalid File Format Choose an image file", parentDiv)
//   
//         }
//         if(FILE_BOOK_size_IMAGE < 2000000 && (FILE_BOOK_type_IMAGE == "image/jpeg" || FILE_BOOK_type_IMAGE == "image/jpg" || FILE_BOOK_type_IMAGE == "image/png")){
//   

//         // ERRORS_ARRAY.pop("IMAGE_TOO_LARGE", "IMAGE_NOT_VALID")
//            SUCCESS.push("IMAGE_IS_VALID")
//    
//         }
//     }

// });

if(SUCCESS.length > 1){
    // $(".submitBookM").trigger("click")
}

removeImage.addEventListener("click", function(){
    if(containerImage.style.display = "block"){
    containerImage.style.display = "none";
    previewText.style.display = "block";
    containerImage.setAttribute("src", "");
    // imgFile.setAttribute("src", "")
    }
  })


//   BRING AND TAKE BOOK UPLOAD MODAL 
var BookModal = document.getElementById("BookUploadModal");
var Bookbtn = document.getElementById("BookUploadBtn");
var BookSpan = document.querySelector(".bkclose");
Bookbtn.onclick = function() {
  BookModal.style.display = "flex";
}
$(".bkclose").on("click", function(){
  BookModal.style.display = "none";
})


window.addEventListener = function(event) {
    if (event.target == BookModal) {
        BookModal.style.display = "none";
    }
  }