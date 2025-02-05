const db = require("../../routes/db.config")

const getMessageNotifications = async (req,res) =>{
try{
    db.query("SELECT from message_notifications WHERE recipient = ?", [req.user.username], (err, data)=>{
        if(err){
            return res.json({error:err})
        }else{
            return res.json({success:"notifications", notifications:data})
        }
    })
}catch(error){
    return res.json({error:error.message})
}
}

module.exports = getMessageNotifications