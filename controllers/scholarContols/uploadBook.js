const db = require("../../routes/db.config");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const newPostNotification = require("../notifications/newPostNotifications");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 120000, // Increase timeout to 2 minutes
});

// Set up multer (store files in memory)
const upload = multer({ storage: multer.memoryStorage() });

// Cloudinary upload function
const uploadToCloudinary = (buffer, fileName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "asfischolar/books", resource_type: "raw", public_id: fileName },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

const uploadBook = async (req, res) => {
  upload.single("file_pdf")(req, res, async function (err) {
    if (err) {
      console.error("Multer error:", err);
      return res.status(500).send("File upload failed.");
    }

    try {
      const { booksTitle, BookOwner, bufferBook, BookOwner_fullname, yearPublished, url_Link, url_title } = req.body;

      if (booksTitle && BookOwner && yearPublished) {
        const currentDate = new Date();
        const options = { month: "short" };
        const dateString = `${currentDate.toLocaleString("en-US", options).slice(0, 3)}, ${String(currentDate.getDate()).padStart(2, "0")}`;

        // Check if the book already exists
        const [existingBook] = await db.promise().query(
          "SELECT * FROM books WHERE book_title = ? AND book_author = ? AND datePublished = ?",
          [booksTitle, BookOwner, dateString]
        );

        if (existingBook.length > 0) {
          return res.render("error.ejs", {
            status: `A book titled ${booksTitle} was uploaded today by @${BookOwner}`,
          });
        }

        if (!req.file) {
          return res.status(400).render("error.ejs", { status: "No file uploaded" });
        }

        const uploadedFile = req.file;
        const fileType = uploadedFile.mimetype;
        const uniqueFilename = `${Date.now()}`;

        // Upload file to Cloudinary
        const fileUrl = await uploadToCloudinary(uploadedFile.buffer, uniqueFilename);

        // Insert book details into database
        await db.promise().query(
          "INSERT INTO books SET ?",
          [{
            book_title: booksTitle,
            book_id: bufferBook,
            book_author: BookOwner,
            book_year: yearPublished,
            file: uniqueFilename,
            book_cover: "cover.jpg",
            fileEXT: fileType,
            datePublished: dateString,
            book_owner_username: BookOwner_fullname,
          }]
        );

        // Insert Cloudinary file URL into `files` table
        await db.promise().query(
          "INSERT INTO files (filename, filedata) VALUES (?, ?)",
          [uniqueFilename, fileUrl]
        );

        console.log("✅ Book uploaded successfully to Cloudinary");

        // Send notification and respond
        const message = `Just uploaded a book`;
        await newPostNotification(req, res, message, `https://asfischolar.org/library/b/${bufferBook}`);
        return res.render("successful.ejs", { status: "Book has been uploaded", page: "/library" });

      } else if (url_Link) {
        // Handle URL-based book upload
        const [existingLink] = await db.promise().query(
          "SELECT * FROM external_links WHERE link_href = ? AND link_owner = ?",
          [url_Link, BookOwner]
        );

        if (existingLink.length > 0) {
          return res.render("error.ejs", { status: "Link Already Exists" });
        }

        await db.promise().query(
          "INSERT INTO external_links SET ?",
          [{ link_href: url_Link, link_owner: BookOwner, link_buffer: bufferBook, link_owner_fullname: BookOwner_fullname, link_title: url_title }]
        );

        return res.render("successful.ejs", { status: "Link Added Successfully", page: "/library" });
      } else {
        return res.status(400).render("error.ejs", { status: "Missing required data" });
      }

    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).send("Internal server error.");
    }
  });
};

module.exports = uploadBook;
