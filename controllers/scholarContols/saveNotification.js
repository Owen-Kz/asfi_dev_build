const db = require("../../routes/db.config");

const saveNotification = async (sender, receiver, message, sender_image, endpoint, isAnnouncement) => {
    try{
    console.log("SAVE NOTIFICATION")

    // Check if notification exists within the last 5 minutes
    const query = `
        SELECT * 
        FROM new_notifications 
        WHERE sender = ? 
        AND recipient = ? 
        AND content = ? 
        AND date_sent >= NOW() - INTERVAL 5 MINUTE
    `;

    db.query(query, [sender, receiver, message], async (err, data) => {
        if (err) {
            console.log(err)
            return err;
        } else if (data[0]) {
            console.log(data)
            return "Data Exists";
        } else {
            db.query(
                "INSERT INTO new_notifications SET ?",
                [{ sender: sender, recipient: receiver, content: message, sender_image: sender_image, end_point:endpoint, isAnnouncement:isAnnouncement }],
                async (err, notified) => {
                    if (err) {
                        console.log(err)
                        throw err
                    }
                    else {
                        console.log("notification sent")
                        return "notification sent";}
                }
            );
        }
    });
}catch(error){
    console.log(error)
}
};

module.exports = saveNotification;
