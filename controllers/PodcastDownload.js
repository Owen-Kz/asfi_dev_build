const os = require("os");
const db = require("../routes/db.config");
const fs = require("fs")
const util = require('util');
const path = require("path");
const writeFile = util.promisify(fs.writeFile);
const unlinkFile = util.promisify(fs.unlink);

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


  const DataID = req.params.downloadFile 

  if (DataID) {
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
    async function getFile(BOOK_FILE) {
      if (
        BOOK_FILE != "avatar.jpg" &&
        BOOK_FILE != "avatar.jpeg" &&
        BOOK_FILE != "" &&
        BOOK_FILE != "cover.jpg"
      ) {
        return new Promise((resolve, reject) => {
          db.query("SELECT * FROM files WHERE filename = ?", [BOOK_FILE], async (err, data) => {
            if (err) reject(err);
    
            if (data[0]) {
              const query = 'SELECT * FROM files WHERE filename = ?';
              const values = [BOOK_FILE];
    
              try {
                db.query(query, values, async(err, data) =>{
                  if(err) throw err
                  const fileData = data[0].filedata;
                  resolve(fileData);
                });
            // Resolve with the file data
              } catch (error) {
                console.error('Error retrieving file:', error);
                reject(null); // Reject with null in case of an error
              }
            } else {
              console.log("File Not Found");
              resolve(null); // Resolve with null if file not found
            }
          });
        });
      } else {
        console.log(BOOK_FILE);
        return null;
      }
    }

    (async () => {
      try {

    // Read the PDF file and extract the page data
    const fileBuffer = await getFile(FILE_MAIN); 

  // Set the file name for download
  const downloadFileName = `${FILE_TITLE}-${FILE_OWNER}_${hostname}${FILE_MAIN_EXT}`;

  // Write the buffer to a temporary file
  const tempFilePath = path.join(__dirname, `../public/userUpload/books/${downloadFileName}`); // Set your temporary file path
  await writeFile(tempFilePath, fileBuffer, 'binary');

  // Send the file for download
  res.download(tempFilePath, downloadFileName, async (err) => {
    if (err) {
      console.error('Error sending file:', err);
  res.render("error.ejs", {status: "Error downloading the file"})

    } else {
      // Unlink (delete) the temporary file after download is complete
      await unlinkFile(tempFilePath);
      console.log('Temporary file deleted successfully');
    }
  });
} catch (error) {
  console.error('Error getting file:', error);
  res.render("error.ejs", {status: "Error retrieving the file"})
}
})();
      }
    })
  }else{
    res.render("error.ejs", {status: "File Not Found"})
  }
};

module.exports =  PodcastDownload ;
 