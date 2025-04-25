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
  if (err) console.error(`The folder '${folderPath}' is not writable:`, err);
});

const allowedFileTypes = [
  "image/jpeg", "image/png", "image/gif",
  "video/mp4", "video/mpeg", "video/quicktime",
  "audio/mpeg", "audio/ogg", "audio/wav",
  "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/pdf"
];

const storage = multer.diskStorage({
  destination: folderPath,
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, uniqueSuffix + fileExtension);
  },
});

const uploads = multer({ storage }).array("files[]", 10);

const SpaceChatFile = async (req, res) => {
  try {
    uploads(req, res, async function (err) {
      if (err) return res.status(500).send(err);

      const { chatId, text, timestamp } = req.body;
      if (!chatId || !timestamp) {
        return res.status(400).json({ error: "Missing required data" });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      // Validate file size and type
      for (const file of req.files) {
        if (!allowedFileTypes.includes(file.mimetype)) {
          return res.status(400).json({ error: `Unsupported file type: ${file.mimetype}` });
        }
        if (file.size > 50 * 1024 * 1024) { // 50MB limit
          return res.status(400).json({ error: `File ${file.originalname} exceeds 50MB limit` });
        }
      }

      // Generate message ID
      const messageId = await generateID();

      // Insert message into database
      db.query(
        "INSERT INTO spaces_messages SET ?",
        [
          {
            sender_id: req.user.username,
            content: text || "",
            buffer: chatId,
            message_type: "file",
            timestamp: timestamp,
            message_id: messageId,
          },
        ],
        (err) => {
          if (err) {
            console.error("Error saving message:", err);
            return res.status(500).json({ error: "Database error when saving message" });
          }
        }
      );

      // Upload files to Cloudinary and save file details in database
      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, { resource_type: "auto" });
          db.query(
            "INSERT INTO chat_files SET ?",
            [
              {
                file_url: result.url,
                file_type: file.mimetype,
                file_name: file.filename,
                file_size: (file.size / 1024).toFixed(2) + " KB",
                chat_id: chatId,
                message_id: messageId,
              },
            ],
            (err) => {
              if (err) console.error("Error saving file details:", err);
            }
          );

          // Delete local file
          fs.unlink(file.path, (err) => {
            if (err) console.error("Error deleting local file:", err);
          });
        } catch (error) {
          console.error("Error uploading to Cloudinary:", error);
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
