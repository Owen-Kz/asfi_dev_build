
var PLAYBUTTON_ID = "<%= PodcastOwner %>_ctrl"
var OwnerID = "#<%= PodcastOwner %>"


var Owner = document.getElementById(OwnerID)
var playbutton = document.getElementById(PLAYBUTTON_ID)
var DownloadBTN = document.getElementById("<%= PodcastOwner %>_dload")
var FILE_NAME = "<%= Podcast_File %>"
var DurationSpan = document.getElementById("<%= PodcastOwner %>_duration")
var FILE_URL = "/userUploads/Audio/<%= Podcast_File %>";

var wavesurfer = WaveSurfer.create({
  container: OwnerID,
  waveColor: 'rgb(205, 205, 205)',
  progressColor: 'rgb(255, 150, 0)',
  barWidth: 4,
  responsive:true,
  height: 30,
  barRadius:4,
  scrollParent: true,
  hideScrollbar: true
})

wavesurfer.load(FILE_URL)
wavesurfer.backend.getDuration()


DownloadBTN.setAttribute("href", '/podcasts/download/'+FILE_NAME)  


// if(wavesurfer.load(FILE_URL)){
//     setTimeout(function(){
// var Duration = Math.round(wavesurfer.backend.getDuration() / 60)
// // console.log(Duration);
//  }, 2000);
// }

playbutton.onclick = function(){
    // wavesurfer.playPause()
    // if($("#<%= PodcastOwner %>_ctrl").hasClass("fa-play")){
    //     $("#<%= PodcastOwner %>_ctrl").removeClass("fa-play")
    //     $("#<%= PodcastOwner %>_ctrl").addClass("fa-pause")
    // }else{
    //     $("#<%= PodcastOwner %>_ctrl").removeClass("fa-pause")
    //     $("#<%= PodcastOwner %>_ctrl").addClass("fa-play")
    // }
}