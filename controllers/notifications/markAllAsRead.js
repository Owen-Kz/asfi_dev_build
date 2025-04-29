const dbPromise = require("../../routes/dbPromise.config")

const markAsRead = async (req,res) =>{
    try{
        const username = req.user.username 
        const userId = String(req.user.id)

        const markAsRead = await dbPromise.query("UPDATE new_notifications SET status = 'read' WHERE (recipient = ? OR recipient = ?) AND status = 'unread'", [username, userId])
        
        const markAsReadMessages = await dbPromise.query("UPDATE message_notifications SET status = 'read' WHERE (recipient = ? OR recipient = ?) AND status = 'unread'", [username, userId])
        if(markAsRead[0].affectedRows > 0 || markAsReadMessages[0].affectedRows > 0){
            console.log("Notifications Marked as Read")
            return res.json({success:"Notifications Marked as Read"})
        } else {
            return res.json({ success: "No notifications to mark as read" });
        }
    }catch(error){
        console.log(error)
        return res.json({error:error.message})
    }
}

module.exports = markAsRead