const os = require("os");
const db = require("../routes/db.config");
const fs = require("fs");
const util = require("util");
const path = require("path");
const axios = require("axios");

const writeFile = util.promisify(fs.writeFile);
const unlinkFile = util.promisify(fs.unlink);
const mkdir = util.promisify(fs.mkdir);

const PodcastDownload = async (req, res) => {
  const DataID = req.params.downloadFile;

  if (!DataID) {
    return res.render("error.ejs", { status: "File Not Found" });
  }

  try {
    // Step 1: Fetch podcast details (fileID) from the podcasts table
    db.query(
      "SELECT * FROM `podcasts` WHERE buffer = ?",
      [DataID],
      async (err, PodcastData) => {
        if (err) {
          console.error("Database query error:", err);
          return res.render("error.ejs", { status: "Database error" });
        }

        if (!PodcastData || PodcastData.length === 0) {
          return res.render("error.ejs", { status: "File Not Found" });
        }

        const FILE_OWNER = PodcastData[0]["podcast_owner"];
        const FILE_TITLE = PodcastData[0]["podcast_title"];
        const FILE_ID = PodcastData[0]["fileID"];
        const FILE_EXT = PodcastData[0]["fileExt"];
        const FILE_URL = PodcastData[0].fileURL
        const buffer = PodcastData[0].buffer

        if (!FILE_ID) {
          return res.render("error.ejs", { status: "File ID not found" });
        }
     
            const FILE_MAIN_EXT = FILE_EXT === "audio/wav" ? ".wav" : ".mp3" || "audio/mpeg";

            if (!FILE_URL) {
              return res.render("error.ejs", { status: "Invalid File URL" });
            }

            try {
              // Step 3: Download the file from the URL
              const response = await axios({
                url: FILE_URL,
                method: "GET",
                responseType: "arraybuffer", // Get the file as binary data
              });

              const fileBuffer = response.data;

              // Step 4: Ensure the directory exists
              const podcastDir = path.join(__dirname, "../public/userUpload/podcasts/");
              if (!fs.existsSync(podcastDir)) {
                await mkdir(podcastDir, { recursive: true }); // Create directory if missing
              }

              // Step 5: Define the temporary file path
              const downloadFileName = `${FILE_TITLE}-${FILE_OWNER}_${FILE_MAIN_EXT}`;
              const tempFilePath = path.join(podcastDir, downloadFileName);

              // Step 6: Write the buffer to a temporary file
              await writeFile(tempFilePath, fileBuffer, "binary");

              // Step 7: Send the file for download
              res.download(tempFilePath, downloadFileName, async (err) => {
                if (err) {
                  console.error("Error sending file:", err);
                  return res.render("error.ejs", { status: "Error downloading the file" });
                }

                // Step 8: Delete the temporary file after successful download
                await unlinkFile(tempFilePath);
                console.log("Temporary file deleted successfully");
                // res.redirect(`/podcast/${buffer}/${FILE_OWNER}`)
              });

            } catch (error) {
              console.error("Error downloading the file:", error);
              res.render("error.ejs", { status: "Error retrieving the file from the URL" });
            }
          }
        );
  
  } catch (error) {
    console.error("Unexpected error:", error);
    res.render("error.ejs", { status: "Server Error" });
  }
};

module.exports = PodcastDownload;
