const dbPromise = require("../../routes/dbPromise.config")

const openNotifications = async (req,res) =>{
    try{
        const {notification_id} = req.body
        const userID = req.user.id
        const username = req.user.username 
        const CheckNotification = await dbPromise.query("SELECT * FROM new_notifications WHERE id = ? AND (recipient = ? OR recipient =?)", [notification_id, username, userID])
        if(CheckNotification[0].length > 0){
            
                const UpdateNotification = await dbPromise.query("UPDATE new_notifications SET status = ? WHERE id = ?", ["read", notification_id])
                if(UpdateNotification[0].affectedRows > 0){
                    console.log("Notification Updated")
                    return res.json({success:"Notification Updated"})
    
            }
        }else{
            return res.json({error:"Notification Not Found"})
        }
    }catch(error){
        console.log(error)
        return res.json({error:error.message})
    }
}


module.exports = openNotifications