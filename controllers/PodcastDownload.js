const os = require("os");
const db = require("../routes/db.config");
// const { download } = require("./utils/downloadPodcasts");

var hostname = os.hostname();
// var NET = os.networkInterfaces();
// var TOTAL_MEM = os.totalmem();
// var TMP_DIR = os.tmpdir()
// var osType = os.type()

// console.log(NET)
// console.log(hostname)
// console.log(TOTAL_MEM)
// console.log(osType)
// console.log(TMP_DIR)


const PodcastDownload = async (req, res) => {
  const protocol = req.protocol;
  const hostname = req.hostname;
  const fullHostname = `${protocol}://${hostname}`;

  if (req.params['downloadFile']) {
    db.query("SELECT * FROM `podcasts` WHERE buffer = ?", [req.params["downloadFile"]], async (er, File) =>{
      if(er) throw er
      if(File){
      FILE_OWNER = File[0]["podcast_owner"]
      FILE_TITLE = File[0]["podcast_title"]
      FILE_MAIN  = File[0]["fileID"];
      FILE_EXT = File[0]["fileExt"]

      if(FILE_EXT = "audio/wav"){
       FILE_MAIN_EXT = ".wav"
      }else{
       FILE_MAIN_EXT = ".mp3"
      }
    
    var FileToDownload = FILE_MAIN;

    res.download("./public/userUpload/audio/"+FileToDownload, `${FILE_TITLE}-${FILE_OWNER}_${hostname}${FILE_MAIN_EXT}`)
      }
    })
  }else{
    res.render("error.ejs", {status: "File Not Found"})
  }
};

module.exports =  PodcastDownload ;
