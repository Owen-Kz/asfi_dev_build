const os = require("os");
const db = require("../routes/db.config");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const axios = require("axios");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const BookDownload = async (req, res) => {
  if (!req.params["downloadFile"]) {
    return res.render("error.ejs", { status: "File Not Found" });
  }

  try {
    // Fetch the book details from the database
    const [rows] = await db.promise().query("SELECT * FROM books WHERE book_id = ?", [req.params["downloadFile"]]);

    if (rows.length === 0) {
      return res.render("error.ejs", { status: "File Not Found" });
    }

    const book = rows[0];
    const FILE_OWNER = book.book_author;
    const FILE_TITLE = book.book_title;
    const FILE_MAIN = book.file;

    // Fetch the Cloudinary file URL
    const [fileRows] = await db.promise().query("SELECT * FROM files WHERE filename = ?", [FILE_MAIN]);

    if (fileRows.length === 0) {
      return res.render("error.ejs", { status: "File Not Found" });
    }

    const fileUrl = fileRows[0].filedata;
    const fileExtension = path.extname(FILE_MAIN);
    const downloadFileName = `${FILE_TITLE}-${FILE_OWNER}_${os.hostname()}${fileExtension}`;

    // Stream the file from Cloudinary and pipe it to the response
    const response = await axios({
      url: fileUrl,
      method: "GET",
      responseType: "stream",
    });

    res.setHeader("Content-Disposition", `attachment; filename=\"${downloadFileName}\"`);
    res.setHeader("Content-Type", response.headers["content-type"]);
    response.data.pipe(res);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.render("error.ejs", { status: "Error retrieving the file" });
  }
};

module.exports = BookDownload;
