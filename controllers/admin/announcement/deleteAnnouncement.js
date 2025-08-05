const dbPromise = require("../../../routes/dbPromise.config");

const deleteAnnouncement = async (req,res) =>{
    try {
        const announcementId = req.params.id; // Get the announcement ID from the URL

        // Delete the announcement from the database
        const result = await dbPromise.query("DELETE FROM announcements WHERE id = ?", [announcementId]);

        if (result[0].affectedRows > 0) {
            return res.json({ success: true, message: "Announcement deleted successfully." });
        } else {
            return res.status(404).json({ error: "Announcement not found." });
        }
    } catch (error) {
        console.error("Error deleting announcement:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

module.exports = deleteAnnouncement;