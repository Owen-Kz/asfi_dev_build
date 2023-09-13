const db = require("../../routes/db.config");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const upload = multer();

const booksFolderPath = path.join(__dirname, "../../public/userUpload/books");
const thumbnailsFolderPath = path.join(__dirname, "../../public/userUpload/bookThumbnails");

fs.access(booksFolderPath, fs.constants.W_OK, (err) => {
  if (err) {
    console.error(`The folder '${booksFolderPath}' is not writable:`, err);
  } else {
    console.log(`The folder '${booksFolderPath}' is writable`);
  }
});

fs.access(thumbnailsFolderPath, fs.constants.W_OK, (err) => {
  if (err) {
    console.error(`The folder '${thumbnailsFolderPath}' is not writable:`, err);
  } else {
    console.log(`The folder '${thumbnailsFolderPath}' is writable`);
  }
});

const booksStorage = multer.diskStorage({
  destination: booksFolderPath,
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1E9);
    const fileName = file.originalname.split(".")[0];
    const fileExtension = path.extname(file.originalname);
    const booksFile = uniqueSuffix + fileExtension;
    cb(null, booksFile);
  },
});

// const thumbnailsStorage = multer.diskStorage({
//   destination: thumbnailsFolderPath,
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1E9);
//     const fileName = file.originalname.split(".")[0];
//     const fileExtension = path.extname(file.originalname);
//     const thumbnailFile = uniqueSuffix + fileExtension;
//     cb(null, thumbnailFile);
//   },
// });

const booksUpload = multer({ storage: booksStorage }).single("file_pdf");
// const thumbnailsUpload = multer({ storage: thumbnailsStorage }).single("image_upload");


const uploadBook = (req, res) => {
  booksUpload(req, res, function (err) {
    if (err) {
      return res.status(500).send(err);
    }

    // thumbnailsUpload(req, res, function (err) {
    //   if (err) {
    //     return res.status(500).send(err);
    //   }

      // Extract the relevant data from req.body
      const { booksTitle, podcastOwner, buffer, podcastOwner_fullname, yearPublished, url_Link} = req.body;
      // console.log(req.body)
      // console.log(req.file)

      if (booksTitle && podcastOwner && yearPublished) {
        const currentDate = new Date();
        const options = { month: "short" };
        const currentMonth = currentDate.toLocaleString("en-US", options).slice(0, 3);
        const currentDay = currentDate.getDate().toString().padStart(2, "0");
        const dateString = `${currentMonth}, ${currentDay}`;
  
        // Check if the data already exists in the database
        db.query(
          "SELECT * FROM books WHERE book_title = ? AND book_author = ? AND datePublished = ?",
          [booksTitle, podcastOwner, dateString],
          (err, exists) => {
            if (err) {
              console.error(err);
              return res.status(500).render("error.ejs",{ status: `A Book already exists with provided Credentials` });
            }
            if (exists[0]) {
              // Data already exists in the database
              return res.render("error.ejs",{
                status: `A books titled ${booksTitle} was uploaded today by @${podcastOwner}`,
              });
            }
            else{
        // Access the uploaded files using req.file and req.thumbnail
        const uploadedFile = req.file;
        // const thumbnailFile = req.thumbnail;

        // ... (rest of your code)

        // INSERT THE UPLOADED FILES WITH DATA INTO THE DATABASE
        const encryptedFileName = uploadedFile.filename;
        // const thumbnailFileName = thumbnailFile.filename;
        const fileType = uploadedFile.mimetype;

        db.query(
          "INSERT INTO books SET ?",
          [
            {
              book_title: booksTitle,
              book_id: buffer,
              book_author: podcastOwner,
              book_year: yearPublished,
              file: encryptedFileName,
              book_cover: "cover.jpg",
              fileEXT: fileType,
              datePublished: dateString,
              book_owner_username: podcastOwner_fullname,
            },
          ],
          (err, booksUploaded) => {
            if (err) {
              console.error(err);
              return res.status(500).render("error.ejs", { status: "Network Error" });
            }

            // Copy the uploaded files to the destination folders
            const sourcePath = uploadedFile.path;
            // const thumbnailPath = thumbnailFile.path;
            const destinationPath = path.join(booksFolderPath, encryptedFileName);
            // const thumbnailDestinationPath = path.join(thumbnailsFolderPath, thumbnailFileName);

            fs.copyFile(sourcePath, destinationPath, (err) => {
              if (err) {
                console.error("Error copying file:", err);
                return res.status(500).render("error.ejs", { status: "Error copying file" });
              }

              // fs.copyFile(thumbnailPath, thumbnailDestinationPath, (err) => {
              //   if (err) {
              //     console.error("Error copying thumbnail:", err);
              //     return res.status(500).render("error.ejs", { status: "Error copying thumbnail" });
              //   }

                // Files copied successfully
                res.render("successful.ejs", { status: "Book has been uploaded", page: "/library" });
              // });
            });
          });
        }
      })
      } if(url_Link){
        console.log(req.body)
        const owner = req.body.BookOwner
        const OwnerFullname = req.body.BookOwner_fullname
        const mainLink = req.body.url_Link
        const bufferLink = req.body.bufferBook
  
        db.query("SELECT * FROM external_links WHERE link_href =? AND link_owner =?", [mainLink, owner] ,async(err,linkExists)=>{
          if(err) throw err
          if(linkExists[0]){
          const linkExists_href = linkExists[0]["link_href"]
          res.render("error", {status:"Link Already Exists"})
          }else{
            db.query("INSERT INTO external_links SET ?", [{link_href:mainLink, link_owner:owner, link_buffer: bufferLink, link_owner_fullname: OwnerFullname}], async (err,Lnk) => {
  
              if(err) throw err
              res.render("successful", {status:"Link Added Succesfully", page:"/library"})
  
            })
          }
        })
        
      }if(!url_Link && !booksTitle){
        
          res.status(400).render("error.ejs", { status: "Missing required data" });
        
      }
    // });
  });
};

module.exports = uploadBook;
