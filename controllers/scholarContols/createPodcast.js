const db = require("../../routes/db.config");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const newPostNotification = require("../notifications/newPostNotifications");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 120000, // Increased timeout to 2 minutes
});

// Set up multer (temporary local storage before Cloudinary upload)
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../temp"), // Temporary folder
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, uniqueSuffix + fileExtension);
  },
});

const uploads = multer({ storage }).single("file_audio");

// Cloudinary upload with retry mechanism
async function uploadToCloudinary(filePath, retries = 3) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await cloudinary.uploader.upload(filePath, {
        resource_type: "auto", // Automatically detects file type
        folder: "/asfischolar/podcasts",
        chunk_size: 6000000, // Upload in 6MB chunks
      });
    } catch (error) {
      if (error.http_code === 499 && attempt < retries - 1) {
        console.log(`Retrying upload (attempt ${attempt + 1})...`);
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3s before retrying
      } else {
        throw error;
      }
    }
  }
}

const createPodcast = (req, res) => {
  uploads(req, res, async function (err) {
    if (err) {
      console.error("Error during file upload:", err);
      return res.status(500).render("error.ejs", { status: "File upload failed" });
    }

    const { podcastTitle, podcastOwner, buffer, podcastOwner_fullname } = req.body;
    if (!podcastTitle || !podcastOwner) {
      return res.status(400).render("error.ejs", { status: "Missing required data" });
    }

    const currentDate = new Date();
    const options = { month: "short" };
    const dateString = `${currentDate.toLocaleString("en-US", options).slice(0, 3)}, ${currentDate.getDate().toString().padStart(2, "0")}`;

    try {
      // Check if the podcast already exists
      const [exists] = await db.promise().query(
        "SELECT * FROM podcasts WHERE podcast_title = ? AND podcast_owner = ? AND date_uploaded = ?",
        [podcastTitle, podcastOwner, dateString]
      ); 

      if (exists.length > 0) {
        return res.render("error.ejs", {
          status: `A podcast titled ${podcastTitle} was uploaded today by @${podcastOwner}`,
        });
      }

      const uploadedFile = req.file;
      if (!uploadedFile) {
        return res.status(400).render("error.ejs", { status: "No file uploaded" });
      }

      const sourcePath = uploadedFile.path;
      const fileType = uploadedFile.mimetype;

      // Upload to Cloudinary with retry
      const cloudinaryUpload = await uploadToCloudinary(sourcePath);
      const cloudinaryUrl = cloudinaryUpload.secure_url;

      // Insert podcast into the database
      await db.promise().query(
        "INSERT INTO podcasts (podcast_title, podcast_owner, podcast_owner_fullname, date_uploaded, fileID, buffer, fileEXT, fileURL) VALUES (?, ?, ?, ?, ?, ?, ?,?)",
        [podcastTitle, podcastOwner, podcastOwner_fullname, dateString, uploadedFile.filename, buffer, fileType, cloudinaryUrl]
      );

      // Insert into the files table
      await db.promise().query(
        "INSERT INTO files (filename, filedata) VALUES (?, ?)",
        [uploadedFile.filename, cloudinaryUrl]
      );

      // Delete the locally stored file after successful upload
      fs.unlink(sourcePath, (unlinkErr) => {
        if (unlinkErr) console.error("Error deleting temp file:", unlinkErr);
      });

      // Send a notification
      const message = `Just uploaded a podcast`;
      await newPostNotification(req, res, message, cloudinaryUrl);

      res.render("successful.ejs", { status: "Podcast has been uploaded", page: "/podcasts" });

    } catch (error) {
      console.error("Error processing podcast:", error);
      res.status(500).render("error.ejs", { status: "Server error" });
    }
  });
};

module.exports = createPodcast;
