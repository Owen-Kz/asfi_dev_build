const db = require("../routes/db.config");
const cloudinary = require("cloudinary").v2;

const PlayPodcastFile = async (req, res) => {
  try {
    const fileBuffer = req.params.buffer;
    console.log("Requested file buffer:", fileBuffer);

    // Fetch podcast details from the database
    const [podcastData] = await db.promise().query(
      "SELECT * FROM podcasts WHERE buffer = ?", 
      [fileBuffer]
    );

    if (podcastData.length === 0) {
      return res.status(404).render("error.ejs", { status: "Podcast not found" });
    }

    const { fileID, fileEXT } = podcastData[0];

    // Fetch file URL from Cloudinary
    const [fileData] = await db.promise().query(
      "SELECT filedata FROM files WHERE filename = ?",
      [fileID]
    );

    if (fileData.length === 0 || !fileData[0].filedata) {
      return res.status(404).render("error.ejs", { status: "Audio file not found on Cloudinary" });
    }

    const cloudinaryUrl = fileData[0].filedata;

    // Respond with the Cloudinary URL instead of serving a local file
    return res.json({ fileUrl: cloudinaryUrl, fileType: fileEXT });

  } catch (error) {
    console.error("Error retrieving podcast file:", error);
    return res.status(500).render("error.ejs", { status: "Server error retrieving podcast" });
  }
};

module.exports = PlayPodcastFile;
