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
  }
});

const storage = multer.diskStorage({
  destination: folderPath,
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, uniqueSuffix + fileExtension);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg", "image/png", "image/gif", "image/webp",
    "video/mp4", "video/mpeg", "video/quicktime",
    "audio/mpeg", "audio/wav", "audio/ogg",
    "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images, videos, audio, and Word documents are allowed."), false);
  }
};

const uploads = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
}).array("files[]", 10);

const privateChatFile = async (req, res) => {
  try {
    uploads(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      const { chatId, text, receiver, timestamp } = req.body;

      if (!chatId || !receiver) {
        return res.status(400).json({ error: "Missing required data" });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const messageId = await generateID();

      db.query(
        "INSERT INTO messages SET ?",
        [{
          sender_id: req.user.username,
          recipient_id: receiver,
          content: text || "",
          buffer: chatId,
          message_type: "file",
          timestamp: timestamp,
          message_id: messageId,
        }],
        async (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error when saving the message" });
          }

          for (const uploadedFile of req.files) {
            const fileSize = (uploadedFile.size / 1024).toFixed(2) + " KB";
            
            try {
              const result = await cloudinary.uploader.upload(uploadedFile.path, { resource_type: "auto" });
              
              db.query(
                "INSERT INTO chat_files SET ?",
                [{
                  file_url: result.url,
                  file_type: uploadedFile.mimetype,
                  file_name: uploadedFile.filename,
                  file_size: fileSize,
                  chat_id: chatId,
                  message_id: messageId,
                }],
                (errored) => {
                  if (errored) {
                    console.error("Error inserting file data into chat_files table:", errored);
                  }
                }
              );
              
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
        }
      );
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = privateChatFile;
