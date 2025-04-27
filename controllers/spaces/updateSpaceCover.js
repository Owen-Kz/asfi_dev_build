const db = require("../../routes/db.config")
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { config } = require("dotenv");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "thumbs",
    allowed_formats: ["jpg", "png", "jpeg", "gif"],
    public_id: (req, file) => `thumbnail_${Date.now()}_${Math.round(Math.random() * 1E9)}`,
  },
});

// 5MB file size limit (in bytes: 5 * 1024 * 1024)
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
}).single("editThumbnail");

const updateSpaceCover = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: "File size too large. Max size is 5MB." });
      }
      return res.status(500).json({ message: "File upload failed", error: err.message });
    }

    try {
      const userId = req.user.id;
      const { space_id } = req.body;
      let thumbnailUrl = req.file ? req.file.path : "cover.jpg"; // Cloudinary URL
  
      if (thumbnailUrl !== "cover.jpg") {
        if(req.user.acct_type === "administrator"){
          db.query(
            "UPDATE spaces SET space_cover = ? WHERE space_id = ?",
            [thumbnailUrl, space_id],
            async (err, data) => {
              if (err) {
                console.log(err);
                return res.json({ error: err });
              }
            }
          );
        }else{
        db.query(
          "UPDATE spaces SET space_cover = ? WHERE space_admin = ? AND space_id = ?",
          [thumbnailUrl, userId, space_id],
          async (err, data) => {
            if (err) {
              console.log(err);
              return res.json({ error: err });
            }
          }
        );
    }
      }
      return res.json({ success: "Space Updated" });
    } catch (error) {
      console.log(error);
      res.json({ error: error.message });
    }
  });
};

module.exports = updateSpaceCover;
