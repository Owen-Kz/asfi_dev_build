const multer = require("multer");
const fs = require("fs");
const path = require("path");
const db = require("../../routes/db.config");
const generateID = require("../admin/generateId");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const folderPath = path.join(__dirname, "../public/userUpload/chatFiles");
fs.access(folderPath, fs.constants.W_OK, (err) => {
  if (err) {
    console.error(`The folder '${folderPath}' is not writable:`, err);
  } else {
    console.log(`The folder '${folderPath}' is writable`);
  }
});

const storage = multer.diskStorage({
  destination: folderPath,
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const profileFile = uniqueSuffix + fileExtension;
    cb(null, profileFile);
  },
});

// Allow up to 10 files
const uploads = multer({ storage }).array("files[]", 10);

const SpaceChatFile = async (req, res) => {
  try { 
    uploads(req, res, async function (err) {
      if (err) { 
        return res.status(500).send(err);
      }

      const { spaceId, text, timestamp } = req.body;

      if (!spaceId || !timestamp) {
        return res.status(400).json({ error: "Missing required data" });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      // Generate a single message ID for the message
      const messageId = await generateID();

      // Save the message only once
      db.query(
        "INSERT INTO spaces_messages SET ?",
        [
          {
            sender_id: req.user.username,
            content: text || "",
            buffer: spaceId,
            message_type: "file",
            timestamp: timestamp,
            message_id: messageId,
          },
        ],
        (err) => {
          if (err) {
            console.error("Error saving message:", err);
            return res.status(500).json({ error: "Database error when saving the message" });
          }
        }
      );

      // Process each file
      for (const uploadedFile of req.files) {
        const encryptedFileName = uploadedFile.filename;
        const FileType = uploadedFile.mimetype;
        const fileSize = ` ${(uploadedFile.size / 1024).toFixed(2)} KB`

        try {
          const result = await cloudinary.uploader.upload(uploadedFile.path);
          const cloudinaryUrl = result.url;

          // Save file details in the chat_files table
          db.query(
            "INSERT INTO chat_files SET ?",
            [
              {
                file_url: cloudinaryUrl,
                file_type: FileType,
                file_name: encryptedFileName,
                file_size: fileSize,
                chat_id: spaceId,
                message_id: messageId,
              },
            ],
            (errored) => {
              if (errored) {
                console.error("Error saving file details:", errored);
              }
            }
          );

          // Delete the local file after uploading to Cloudinary
          fs.unlink(uploadedFile.path, (unlinkErr) => {
            if (unlinkErr) {
              console.error("Error deleting local file:", unlinkErr);
            }
          });
        } catch (error) {
          console.error("Error during Cloudinary upload:", error);
        }
      }

      return res.json({ success: "Message and files uploaded successfully" });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = SpaceChatFile;
