const db = require("../../routes/db.config");

const saveMessageNotification = async (sender, receiver, message, sender_image, endpoint) => {
    try{
    console.log("SAVE NOTIFICATION")
  
    // Check if notification exists within the last 5 minutes
    const query = `
        SELECT * 
        FROM message_notifications 
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
    
            return "Data Exists";
        } else {
            db.query(
                "INSERT INTO message_notifications SET ?",
                [{ sender: sender, recipient: receiver, content: message, sender_image: sender_image, end_point:endpoint }],
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

module.exports = saveMessageNotification;
