const db = require("../../routes/db.config");

const NewNotifications = async (req,res) =>{
    const NotificationOwner = req.params.username
    db.query("SELECT * FROM chat_buffer WHERE user_one =? OR user_two =?", [NotificationOwner, NotificationOwner], async (err, notification)=>{
        if(err) throw err
        const NotificationsArrayMain = []
            notification.forEach(msg => {
                NotificationsArrayMain.push(msg)
            });

            res.json({NotificationData:JSON.stringify(NotificationsArrayMain)})
     
    })    
}

module.exports = NewNotifications