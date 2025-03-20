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

// Cloudinary upload function with retry mechanism
const uploadToCloudinary = async (buffer, fileName, retries = 3) => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      console.log(`Uploading file to Cloudinary (Attempt ${attempt + 1})...`);
      return await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "asfischolar/podcasts", resource_type: "auto", public_id: fileName },
          (error, result) => {
            if (error) {
              console.error(`Cloudinary upload error (Attempt ${attempt + 1}):`, error);
              return reject(error);
            }
            resolve(result.secure_url);
          }
        );
        stream.end(buffer);
      });
    } catch (error) {
      console.error(`Error during upload (Attempt ${attempt + 1}):`, error);
      if (attempt < retries - 1) {
        console.log(`Retrying upload (Attempt ${attempt + 2})...`);
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3s before retrying
      } else {
        throw error;
      }
    }
    attempt++;
  }
};

const createPodcast = async (req, res) => {
  try {
    upload.single("file_audio")(req, res, async function (err) {
      if (err) {
        console.error("Multer error:", err);
        return res.status(500).send("File upload failed.");
      }

      const { podcastTitle, podcastOwner, buffer, podcastOwner_fullname } = req.body;
      if (!podcastTitle || !podcastOwner) {
        return res.status(400).render("error.ejs", { status: "Missing required data" });
      }

      const currentDate = new Date();
      const options = { month: "short" };
      const dateString = `${currentDate.toLocaleString("en-US", options).slice(0, 3)}, ${currentDate.getDate().toString().padStart(2, "0")}`;

      // Check if podcast already exists
      const [exists] = await db.promise().query(
        "SELECT * FROM podcasts WHERE podcast_title = ? AND podcast_owner = ? AND date_uploaded = ?",
        [podcastTitle, podcastOwner, dateString]
      );

      if (exists.length > 0) {
        return res.render("error.ejs", { status: `A podcast titled ${podcastTitle} was uploaded today by @${podcastOwner}` });
      }

      if (!req.file) {
        return res.status(400).render("error.ejs", { status: "No file uploaded" });
      }

      const uploadedFile = req.file;
      const fileType = uploadedFile.mimetype;
      const uniqueFilename = `${Date.now()}-${uploadedFile.originalname}`;

      try {
        // Upload file to Cloudinary with retry mechanism
        const cloudinaryUrl = await uploadToCloudinary(uploadedFile.buffer, uniqueFilename);

        // Insert podcast details into database
        await db.promise().query(
          "INSERT INTO podcasts (podcast_title, podcast_owner, podcast_owner_fullname, date_uploaded, fileID, buffer, fileEXT, fileURL) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [podcastTitle, podcastOwner, podcastOwner_fullname, dateString, uniqueFilename, buffer, fileType, cloudinaryUrl]
        );

        // Insert file reference into files table
        await db.promise().query("INSERT INTO files (filename, filedata) VALUES (?, ?)", [uniqueFilename, cloudinaryUrl]);

        console.log("Podcast uploaded successfully to Cloudinary");

        // Send notification
        const message = `Just uploaded a podcast`;
        await newPostNotification(req, res, message, cloudinaryUrl);

        res.render("successful.ejs", { status: "Podcast has been uploaded", page: "/podcasts" });
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        res.status(500).render("error.ejs", { status: "Error uploading to Cloudinary" });
      }
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).send("Internal server error.");
  }
};

module.exports = createPodcast;
