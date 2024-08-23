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



$("#submitBook").on("click", function(){
$(".submitBookM").trigger("click")

})


