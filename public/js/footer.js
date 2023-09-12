document.write('<footer> <div class="col-md-4 text-center text-md-start mb-3 mb-md-0"><a href=""> <img class="h-20px" src="/files/images/ASFIScholar_Logo.png" alt="logo"> </a></div>&copy;' + new Date().getFullYear() + ' - ASFIScholar  <div class="col-md-4"><ul class="list-inline mb-0 text-center text-md-end"><li class="list-inline-item ms-2"><a href="#"><i class="text-white fab fa-facebook"></i></a></li><li class="list-inline-item ms-2"><a href="#"><i class="text-white fab fa-instagram"></i></a></li><li class="list-inline-item ms-2"><a href="#"><i class="text-white fab fa-linkedin-in"></i></a></li><li class="list-inline-item ms-2"><a href="#"><i class="text-white fab fa-twitter"></i></a></li></ul></div></footer>')




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
