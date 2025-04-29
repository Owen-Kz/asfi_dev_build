const dbPromise = require("../../routes/dbPromise.config")

const countMyNotifications = async (req,res) =>{
    try{
        const userID = req.user.id
        const username = req.user.username 
        const CheckNotification = await dbPromise.query("SELECT COUNT(*) as notifications_count FROM new_notifications WHERE (recipient = ? OR recipient =?) AND status = 'unread' ", [username, userID])
        const myMessageNotifications = await dbPromise.query("SELECT COUNT(*) as message_count FROM message_notifications WHERE (recipient = ? OR recipient =?) AND status = 'unread'", [username, userID])
        if(CheckNotification[0].length > 0){
            return res.json({success:"Notifications Available", notifications_count:CheckNotification[0][0].notifications_count, message_count:myMessageNotifications[0][0].message_count})
        }else{
            return res.json({error:"No Notifications"})
        }
    }catch(error){
        console.log(error)
        return res.json({error:error.message})
    }
}
module.exports = countMyNotifications