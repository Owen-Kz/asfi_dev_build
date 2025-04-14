const db = require("../../routes/db.config");

const AllNotifications = async (req, res) => {
    try {
        const NotificationOwner = req.user.id
        const username = req.user.username
        // const isChat = singleFile.substring(singleFile.lastIndexOf("/") + 1);
        db.query(   `SELECT * FROM new_notifications 
            WHERE (recipient = ? OR recipient = ? OR isAnnouncement = 'yes') 
            AND (end_point IS NULL OR end_point = '' OR end_point NOT LIKE ?) 
            ORDER BY id DESC 
            LIMIT 30`,         
            [NotificationOwner, username, '%chat'], async (err, notification) => {
            if (err) throw err
            if (notification[0]) {
                res.json({ NotificationData: notification })
            } else {
                res.json({ message: "No data", NotificationData: [] })
            }
        })
    } catch (error) {
        console.log(error)
        return (res.json({ error: "error", message: error.message, NotificationData: [] }))
    }
}

module.exports = AllNotifications