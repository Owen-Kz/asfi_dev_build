const db = require("../../../routes/db.config");
const dbPromise = require("../../../routes/dbPromise.config");
const multer = require("multer")
const upload = multer({
    limits: {
        fieldSize: 500 * 1024 * 1024 // 10MB
    }
});
const updateAnnouncement = async (req, res) => {
    upload.none() (req, res, async function (err) {
    try {
        const announcementId = req.params.id; // Get the announcement ID from the URL
        const { title, content, priority } = req.body; // Get the data from the request body

        // Validate input
        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required." });
        }

        // Update the announcement in the database
        const result = await dbPromise.query(
            "UPDATE announcements SET title = ?, data = ?, priority = ? WHERE id = ?",
            [title, content, priority ? 1 : 0, announcementId]
        );

        // update all others to not priority 
        if(priority == "1" || priority == 1 || priority == true || priority == "true"){
            await dbPromise.query(
                "UPDATE announcements SET priority = 0 WHERE id != ? AND priority = 1",
                [announcementId]
            );
        }

        if (result[0].affectedRows > 0) {
            return res.json({ success: true, message: "Announcement updated successfully." });
        } else {
            return res.status(404).json({ error: "Announcement not found." });
        }
    } catch (error) {
        console.error("Error updating announcement:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
});
}

module.exports = updateAnnouncement;