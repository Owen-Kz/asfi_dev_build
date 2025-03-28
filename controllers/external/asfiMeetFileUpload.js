const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;

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

const uploads = multer({ storage }).single("file");

// ✅ Cloudinary upload with retry mechanism
async function uploadToCloudinary(filePath, retries = 3) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      console.log(`Uploading file to Cloudinary (Attempt ${attempt + 1})...`);
      return await cloudinary.uploader.upload(filePath, {
        resource_type: "auto",
        folder: "/asfimeet/chatfiles",
        chunk_size: 6000000, // Upload in 6MB chunks
      });
    } catch (error) {
      console.error(`Cloudinary upload error (Attempt ${attempt + 1}):`, error);
      if (attempt < retries - 1) {
        console.log(`Retrying upload (attempt ${attempt + 1})...`);
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3s before retrying
      } else {
        throw error;
      }
    }
  }
}

// ✅ Main function to create ASFIMeet File
const asfiMeetFileUpload = (req, res) => {
  console.log("\n🔹 New ASFIMeet File Upload Request Received");

  uploads(req, res, async function (err) {
    if (err) {
      console.error("❌ Multer Error:", err);
      return res.json({ error: "error", status: "File upload failed" });
    }

    if (!req.file) {
      console.error("❌ No file uploaded");
      return res.json({ error: "Invalid file", status: "No file uploaded" });
    }

    console.log("✅ File successfully uploaded to temp storage");
    console.log("Uploaded File Details:", req.file);

    const uploadedFile = req.file;
    const sourcePath = uploadedFile.path;

    // ✅ Ensure file is fully written before reading
    setTimeout(async () => {
      try {
        console.log("🚀 Uploading file to Cloudinary...");
        const cloudinaryUpload = await uploadToCloudinary(sourcePath);
        const cloudinaryUrl = cloudinaryUpload.secure_url;
        console.log("✅ Cloudinary Upload Successful:", cloudinaryUrl);

        // ✅ Delete temp file
        console.log("🗑️ Deleting temp file:", sourcePath);
        fs.unlink(sourcePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("❌ Error deleting temp file:", unlinkErr);
          } else {
            console.log("✅ Temp file deleted");
          }
        });

        res.json({ success: "fileUploaded", secure_url: cloudinaryUrl });
      } catch (error) {
        console.error("❌ Error processing ASFIMeet File:", error);
        return res.json({ error: "error", status: "Server error" });
      }
    }, 500); // Delay to ensure file system synchronization
  });
};

module.exports = asfiMeetFileUpload;
