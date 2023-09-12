const os = require("os");
const db = require("../routes/db.config");
// const { download } = require("./utils/downloadPodcasts");

var hostname = os.hostname();

const BookDownload = async (req, res) => {
  const protocol = req.protocol;
  const hostname = req.hostname;
  const fullHostname = `${protocol}://${hostname}`;

  if (req.params['downloadFile']) {
    db.query("SELECT * FROM `books` WHERE book_id = ?", [req.params["downloadFile"]], async (er, File) =>{
      if(er) throw er
      if(File){
      FILE_OWNER = File[0]["book_author"]
      FILE_TITLE = File[0]["book_title"]
      FILE_MAIN  = File[0]["file"];
      FILE_EXT = File[0]["fileExt"]

      if(FILE_EXT = "application/pdf"){
       FILE_MAIN_EXT = ".pdf"
      }
    
    var FileToDownload = FILE_MAIN;

    res.download("./public/userUpload/books/"+FileToDownload, `${FILE_TITLE}-${FILE_OWNER}_${hostname}${FILE_MAIN_EXT}`)
      }
    })
  }else{
    res.render("error.ejs", {status: "File Not Found"})
  }
};

module.exports =  BookDownload ;
