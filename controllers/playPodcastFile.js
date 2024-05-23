const db = require("../routes/db.config");
const path =  require("path")
const fs = require("fs")

const PlayPodcastFile = async (req,res) =>{
    const fileBuffer = req.params.buffer

    console.log(fileBuffer)

    db.query("SELECT * FROM podcasts WHERE buffer = ? ", [fileBuffer], async (err, data)=>{
        if(err) throw err
        if(data[0]){

            FILE_MAIN  = data[0]["fileID"];
            FILE_EXT = data[0]["fileExt"]
      
            if(FILE_EXT = "audio/wav"){
             FILE_MAIN_EXT = ".wav"
            }else{
             FILE_MAIN_EXT = ".mp3"
            }

    async function getFile(Podcast_File) {
        if (
          Podcast_File != "avatar.jpg" &&
          Podcast_File != "avatar.jpeg" &&
          Podcast_File != "" &&
          Podcast_File != "cover.jpg"
        ) {
          return new Promise((resolve, reject) => {
            db.query("SELECT * FROM files WHERE filename = ?", [Podcast_File], async (err, data) => {
              if (err) reject(err);
      
              if (data[0]) {
                const query = 'SELECT * FROM files WHERE filename = ?';
                const values = [Podcast_File];
      
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
          console.log(Podcast_File);
          return null;
        }
      }

      (async () => {
        try {
  
      // Read the PDF file and extract the page data
      const fileBuffer = await getFile(FILE_MAIN); 
  
    // Set the file name for download
    const FileName = `${FILE_MAIN}`;
  
    // Write the buffer to a temporary file
    const tempFilePath = path.join(__dirname, `../public/userUpload/audio/${FileName}`); // Set your temporary file path
    // Function to check if a file exists in the directory
    function fileExists(filePath) {
        return fs.existsSync(filePath);
    }
    
    // Writing the file if it doesn't exist
    async function writeFileIfNotExists(filePath, fileBuffer) {
        if (!fileExists(filePath)) {
        try {
            await fs.promises.writeFile(filePath, fileBuffer, 'binary');
            console.log('File written successfully.');
            res.json(filePath)
        } catch (error) {
            console.error('Error writing the file:', error);
        }
        } else {
        console.log('File already exists in the directory.');
            res.json(filePath)
        }
    }
    writeFileIfNotExists(tempFilePath, fileBuffer);
        // Unlink (delete) the temporary file after download is complete
        // res.json({new_file: tempFilePath})
        console.log(tempFilePath)
        // await unlinkFile(tempFilePath);
        // console.log('Temporary file deleted successfully');
      
   
  } catch (error) {
    console.error('Error getting file:', error);
    res.render("error.ejs", {status: "Error retrieving the file"})
  }
  })();
        }
    })
}

module.exports = PlayPodcastFile