const db = require("../routes/db.config");
const multer = require("multer");
const path = require("path");
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
    folder: "thumbs", // Uploads to this folder in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "gif"],
    public_id: (req, file) => `thumbnail_${Date.now()}_${Math.round(Math.random() * 1E9)}`,
  },
});

const upload = multer({ storage }).single("thumbnail");

function generateSpaceKey() {
  let part1 = Math.floor(100 + Math.random() * 900);
  let part2 = Math.floor(100 + Math.random() * 900);
  return `${part1}-${part2}`;
}

const createSpaces = async (req, res) => {
  upload(req, res, async (err) => {

    if (err) {
        console.log(err)
      return res.status(500).json({ message: "File upload failed", error: err.message });
    }

    const { spaceTitle, shortDescription, bufferSpace, privateSpace } = req.body;
    const FromPosters = req.query.fromPosters;
    
    if (!bufferSpace) {
      return res.json({ message: "An Error Occurred: Buffer is missing" });
    }

    try {
      db.query("SELECT * FROM spaces WHERE space_id = ?", [bufferSpace], (err, spaceData) => {
        if (err) throw err;

        if (spaceData[0]) {
          res.json({ message: "This space already exists" });
        } else {
          let privateKey = privateSpace === "yes" ? generateSpaceKey() : "no";
          let thumbnailUrl = req.file ? req.file.path : null; // Cloudinary URL

          db.query(
            "INSERT INTO spaces SET ?",
            [
              {
                space_id: bufferSpace,
                space_focus: spaceTitle,
                space_description: shortDescription,
                isFromPoster: FromPosters === "true" ? "true" : "false",
                space_passkey: privateKey,
                is_private: privateSpace,
                space_admin: req.user.id,
                space_cover: thumbnailUrl, // Store thumbnail URL in DB
              },
            ],
            (err, newSpace) => {
              if (err) throw err;

              if (newSpace) {
                res.json({
                  success: "space_created",
                  message: "Space Created Successfully",
                  space_key: privateKey,
                  thumbnail_url: thumbnailUrl, // Return the Cloudinary URL
                });
              }
            }
          );
        }
      });
    } catch (error) {
      console.error(error);
      return res.json({ message: error.message });
    }
  });
};

module.exports = createSpaces;
