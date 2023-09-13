const db = require("../../routes/db.config");

const NewNotifications = async (req,res) =>{
    const NotificationOwner = req.user.username
    console.log(NotificationOwner)
    db.query("SELECT * FROM chat_buffer WHERE user_one =? OR user_two =?", [NotificationOwner, NotificationOwner], async (err, notification)=>{
        if(err) throw err
        if(notification){
        const NotificationsArrayMain = []
            notification.forEach(msg => {
                NotificationsArrayMain.push(msg)
            });

            res.json({NotificationData:JSON.stringify(NotificationsArrayMain)})
        }else{
            res.json({message: "No data", NotificationData:"[]"})
        }
     
    })
}

module.exports = NewNotifications