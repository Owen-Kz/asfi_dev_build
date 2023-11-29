const db = require("../routes/db.config");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const folderPath = path.join(__dirname, "../public/userUpload/profilePhotos");
fs.access(folderPath, fs.constants.W_OK, (err) => {
  if (err) {
    // console.error(`The folder '${folderPath}' is not writable:`, err);
  } else {
    // console.log(`The folder '${folderPath}' is writable`);
  }
});

const storage = multer.diskStorage({
  destination: folderPath,
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1E9);
    const fileName = file.originalname.split(".")[0];
    const fileExtension = path.extname(file.originalname);
    const profileFile = uniqueSuffix + fileExtension;
    cb(null, profileFile);
  },
});

const uploads = multer({ storage }).single("profileImage");

const profileImageUpload = (req, res) => {
  uploads(req, res, function (err) {
    if (err) {
      // An error occurred during file upload
      return res.status(500).send(err);
    }

    // Extract the relevant data from req.body
    const { bufferImage } = req.body;

  

    const userName = req.user.username;

    if (bufferImage && userName) {
      // GET THE DATE
      const currentDate = new Date();
      const options = { month: "short" };
      const currentMonth = currentDate.toLocaleString("en-US", options).slice(0, 3);
      const currentDay = currentDate.getDate().toString().padStart(2, "0");
      const dateString = `${currentMonth}, ${currentDay}`;

      // Check if the data already exists in the database
          if (err) {
            console.error(err);
            return res.status(500).render("error.ejs",{ status: "Network Error / Server Error" });
          }
          else{
          // Access the uploaded file using req.file
          const uploadedFile = req.file;

          // INSERT THE UPLOADED FILE WITH DATA INTO THE DATABASE
          const encryptedFileName = uploadedFile.filename;
          const FileType = uploadedFile.mimetype;

          const buffer = fs.readFileSync(uploadedFile.path);
          // const imageBuffer = fs.readFileSync(imageFile.path)
        
          const query = `INSERT INTO files (filename, filedata) VALUES (?, ?)`;
          const values = [uploadedFile.filename, buffer];


          db.query( 
            "UPDATE user_info SET ? WHERE username =?",
            [{profile_picture:encryptedFileName, buffer:bufferImage}, [userName]],
            (err, podcastUploaded) => {
              if (err) {
                console.error(err);
                return res.status(500).render("error.ejs",{ status: "Network Error" });
              }

              // Copy the uploaded file to the destination folder
              const sourcePath = uploadedFile.path;
              const destinationPath = path.join(folderPath, encryptedFileName);
 
              // console.log(sourcePath)
              // console.log(uploadedFile)

              fs.copyFile(sourcePath, destinationPath, (err) => {
                if (err) {
                  console.error("Error copying file:", err);
                  return res.status(500).render("error.ejs",{status: "Error copying file" });
                }
               // File copied successfully
          db.query(query, values, async(err,image)=>{
            if(err) throw err
            console.log("image Inserted Successfully")

            fs.unlink(sourcePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error('Error deleting local PDF file:', unlinkErr);
            } else {
              console.log('Local PDF file deleted successfully.');
            }
            });
          res.redirect('/settings')

          })
              });
            }
          );
          }
     
    } else {
      res.status(400).render("error.ejs",{ status: "Missing required data" });
    }
  });
};

module.exports = profileImageUpload;
