const db = require("../../routes/db.config");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const newPostNotification = require("../notifications/newPostNotifications");

// ✅ Log Environment Variables (Check if Cloudinary configs are loaded)
console.log("CLOUDINARY CONFIG:");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "Loaded" : "MISSING");
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "Loaded" : "MISSING");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 120000, // Increased timeout to 2 minutes
});

// Ensure temp directory exists
const tempDir = path.join(__dirname, "../../temp");
if (!fs.existsSync(tempDir)) {
  console.log("Creating temp directory:", tempDir);
  fs.mkdirSync(tempDir, { recursive: true });
} else {
  console.log("Temp directory exists:", tempDir);
}

// Set up multer (temporary local storage before Cloudinary upload)
const storage = multer.diskStorage({
  destination: tempDir, // Temporary folder
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, uniqueSuffix + fileExtension);
  },
});

const uploads = multer({ storage }).single("file_audio");

// ✅ Cloudinary upload with retry mechanism
async function uploadToCloudinary(filePath, retries = 3) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      console.log(`Uploading file to Cloudinary (Attempt ${attempt + 1})...`);
      return await cloudinary.uploader.upload(filePath, {
        resource_type: "auto",
        folder: "/asfischolar/podcasts",
        chunk_size: 6000000, // Upload in 6MB chunks
      });
    } catch (error) {
      console.error(`Cloudinary upload error (Attempt ${attempt + 1}):`, error);
      if (error.http_code === 499 && attempt < retries - 1) {
        console.log(`Retrying upload (attempt ${attempt + 1})...`);
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3s before retrying
      } else {
        console.log(error)
        throw error;
      }
    }
  }
}

// ✅ Main function to create podcast
const createPodcast = (req, res) => {
  console.log("\n🔹 New Podcast Upload Request Received");

  uploads(req, res, async function (err) {
    if (err) {
      console.error("❌ Multer Error:", err);
      return res.status(500).render("error.ejs", { status: "File upload failed" });
    }

    console.log("✅ File successfully uploaded to temp storage");
    console.log("Uploaded File Details:", req.file);

    const { podcastTitle, podcastOwner, buffer, podcastOwner_fullname } = req.body;
    console.log("Podcast Metadata Received:", { podcastTitle, podcastOwner, podcastOwner_fullname });

    if (!podcastTitle || !podcastOwner) {
      console.error("❌ Missing podcast title or owner");
      return res.status(400).render("error.ejs", { status: "Missing required data" });
    }

    const currentDate = new Date();
    const options = { month: "short" };
    const dateString = `${currentDate.toLocaleString("en-US", options).slice(0, 3)}, ${currentDate.getDate().toString().padStart(2, "0")}`;

    try {
      // ✅ Check if the podcast already exists
      console.log("🔍 Checking if podcast already exists...");
      const [exists] = await db.promise().query(
        "SELECT * FROM podcasts WHERE podcast_title = ? AND podcast_owner = ? AND date_uploaded = ?",
        [podcastTitle, podcastOwner, dateString]
      );

      if (exists.length > 0) {
        console.error("❌ Duplicate podcast detected");
        return res.render("error.ejs", {
          status: `A podcast titled ${podcastTitle} was uploaded today by @${podcastOwner}`,
        });
      }

      const uploadedFile = req.file;
      if (!uploadedFile) {
        console.error("❌ No file uploaded");
        return res.status(400).render("error.ejs", { status: "No file uploaded" });
      }

      const sourcePath = uploadedFile.path;
      const fileType = uploadedFile.mimetype;

      // ✅ Upload to Cloudinary with retry
      console.log("🚀 Uploading file to Cloudinary...");
      const cloudinaryUpload = await uploadToCloudinary(sourcePath);
      const cloudinaryUrl = cloudinaryUpload.secure_url;
      console.log("✅ Cloudinary Upload Successful:", cloudinaryUrl);

      // ✅ Insert podcast into database
      console.log("📌 Inserting podcast into database...");
      await db.promise().query(
        "INSERT INTO podcasts (podcast_title, podcast_owner, podcast_owner_fullname, date_uploaded, fileID, buffer, fileEXT, fileURL) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [podcastTitle, podcastOwner, podcastOwner_fullname, dateString, uploadedFile.filename, buffer, fileType, cloudinaryUrl]
      );

      // ✅ Insert file reference into files table
      console.log("📌 Inserting file reference into database...");
      await db.promise().query(
        "INSERT INTO files (filename, filedata) VALUES (?, ?)",
        [uploadedFile.filename, cloudinaryUrl]
      );

      // ✅ Delete temp file
      console.log("🗑️ Deleting temp file:", sourcePath);
      fs.unlink(sourcePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("❌ Error deleting temp file:", unlinkErr);
        } else {
          console.log("✅ Temp file deleted");
        }
      });

      // ✅ Send notification
      console.log("🔔 Sending new podcast notification...");
      const message = `Just uploaded a podcast`;
      const userData = { user: { username: podcastOwner } };
      await newPostNotification(req, res, message, cloudinaryUrl);
      console.log("✅ Notification sent successfully");

      // ✅ Render success page
      res.render("successful.ejs", { status: "Podcast has been uploaded", page: "/podcasts" });

    } catch (error) {
      console.error("❌ Error processing podcast:", error);
      res.status(500).render("error.ejs", { status: "Server error" });
    }
  });
};

module.exports = createPodcast;
