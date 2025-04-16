




  // CLOSE THE PODCAST MODAL
  var CloseModalPodcast = document.getElementById("closePodcastModal")

  if(CloseModalPodcast){
  CloseModalPodcast.onclick = function() {
      window.location.href = "/podcasts"
  }
}else{
    
}


// GET BACK AT THIS
// genPassword()
// // GENERATE RANDOM ID TO AD TO PODCAST SERACH QUERY 
// function genPassword() {
// var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
// var passwordLength = 24;
// var podcastID_ENC = "";
// for (var i = 0; i <= passwordLength; i++) {
// var randomNumber = Math.floor(Math.random() * chars.length);
// podcastID_ENC += chars.substring(randomNumber, randomNumber +1);
// }
// document.getElementById(PLAYBUTTON_ID_HREF).href += `/${podcastID_ENC}` 
// }
