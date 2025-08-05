const dbPromise = require("../../../routes/dbPromise.config");
const { QuillDeltaToHtmlConverter } = require("quill-delta-to-html");

const getAnnouncements = async (req, res) => {
    try {
        const announcements = await dbPromise.query("SELECT * FROM announcements ORDER BY id DESC");

        if (announcements[0].length > 0) {
            return announcements[0].map(announcement => {
                let htmlContent = "";

                try {
                    // Parse Quill Delta JSON
                    const delta = JSON.parse(announcement.data);

                  

                    // Convert Delta to HTML
                    const converter = new QuillDeltaToHtmlConverter(delta, { inlineStyles: true });
                    htmlContent = converter.convert();

                   
                } catch (err) {
                    console.error(`Error parsing Quill Delta for announcement ID ${announcement.id}:`, err.message);
                    htmlContent = announcement.data; // fallback to raw data
                }

                return {
                    id: announcement.id,
                    title: announcement.title,
                    content: htmlContent,
                    quillContent: announcement.data,
                    timestamp: announcement.timestamp,
                    priority: announcement.priority
                };
            });
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching announcements:", error.message);
        return { status: "error", message: "Failed to fetch announcements" };
    }
};

module.exports = getAnnouncements;
