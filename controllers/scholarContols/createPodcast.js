const db = require("../../routes/db.config");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const newPostNotification = require("../notifications/newPostNotifications");
const generateRandomString = require("../admin/utils/randomSring");

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 120000, // 2 minutes timeout
});

// ✅ Ensure temp directory exists
const tempDir = path.join(__dirname, "../../temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// ✅ Set up multer (temporary local storage before Cloudinary upload)
const storage = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const uploads = multer({ storage }).single("file_audio");

// ✅ Cloudinary upload function (no retries)
const uploadToCloudinary = async (filePath) => {
  console.log("🚀 Uploading file to Cloudinary...");
  try {
    return await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      folder: "/asfischolar/podcasts",
      chunk_size: 6000000, // Upload in 6MB chunks
    });
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    throw new Error("Cloudinary upload failed");
  }
};

// ✅ Main function to handle podcast upload
const createPodcast = (req, res) => {
  console.log("\n🔹 New Podcast Upload Request Received");

  uploads(req, res, async (err) => {
    if (err) {
      console.error("❌ Multer Error:", err);
      return res.status(500).render("error.ejs", { status: "File upload failed" });
    }

    if (!req.file) {
      console.error("❌ No file uploaded");
      return res.status(400).render("error.ejs", { status: "No file uploaded" });
    }

    console.log("✅ File successfully uploaded to temp storage:");

    const { podcastTitle, podcastOwner, podcastOwner_fullname } = req.body;
    if (!podcastTitle || !podcastOwner) {
      return res.status(400).render("error.ejs", { status: "Missing required data" });
    }

    const currentDate = new Date();
    const dateString = currentDate.toLocaleString("en-US", { month: "short" }) + ", " + String(currentDate.getDate()).padStart(2, "0");

    try {
      // ✅ Check if the podcast already exists
      const [exists] = await db.promise().query(
        "SELECT * FROM podcasts WHERE podcast_title = ? AND podcast_owner = ? AND date_uploaded = ?",
        [podcastTitle, podcastOwner, dateString]
      );

      if (exists.length > 0) {
        return res.render("error.ejs", { status: `A podcast titled ${podcastTitle} was uploaded today by @${podcastOwner}` });
      }

      const sourcePath = req.file.path;
      const fileType = req.file.mimetype;

      // ✅ Upload to Cloudinary
      const cloudinaryUpload = await uploadToCloudinary(sourcePath);
      const cloudinaryUrl = cloudinaryUpload.secure_url;
      console.log("✅ Cloudinary Upload Successful:", cloudinaryUrl);
      const buffer = await generateRandomString(8)
      // ✅ Insert podcast into database
      await db.promise().query(
        "INSERT INTO podcasts (podcast_title, podcast_owner, buffer, podcast_owner_fullname, date_uploaded, fileID, fileEXT, fileURL) VALUES (?,?, ?, ?, ?, ?, ?, ?)",
        [podcastTitle, podcastOwner, buffer, podcastOwner_fullname, dateString, req.file.filename, fileType, cloudinaryUrl]
      );

      // ✅ Delete temp file
      fs.unlink(sourcePath, (unlinkErr) => {
        if (unlinkErr) console.error("❌ Error deleting temp file:", unlinkErr);
        else console.log("✅ Temp file deleted");
      });

      // ✅ Send notification
      const message = `Just uploaded a podcast`;
      await newPostNotification(req, res, message, cloudinaryUrl);

      // ✅ Render success page
      res.render("successful.ejs", { status: "Podcast has been uploaded", page: "/podcasts" });
    } catch (error) {
      console.error("❌ Error processing podcast:", error);
      res.status(500).render("error.ejs", { status: "Server error" });
    }
  });
};

module.exports = createPodcast;
