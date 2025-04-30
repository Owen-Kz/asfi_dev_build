const dbPromise = require("../../routes/dbPromise.config")

const saveReaction = async (req,res) =>{
try{
    const {reactionType, post_id, post_type, person} = req.body 
    const userId = req.user.id
    const userName = req.user.username 

    const personID = await dbPromise.query("SELECT id FROM user_info WHERE username = ?", [person])
    if(!personID[0][0]){
        return res.json({error:"Person Not Found"})
    }
    const personID_main = personID[0][0].id
   
    const CheckNotificatoinsExist = await dbPromise.query("SELECT * FROM new_notifications WHERE end_point = ? AND (recipient = ? OR recipient = ?)", [post_id, person, personID_main] )

    if(CheckNotificatoinsExist[0].length > 0){

    }else{
        const notification = `${userName} reacted to your post`
        const SaveNotification = await dbPromise.query("INSERT INTO new_notifications SET ?", [{end_point:post_id, content:notification, recipient:person, sender:userName, sender_image:req.user.profile_picture}])
        if(SaveNotification[0].affectedRows > 0){
            console.log("Notification Saved")
        }
    }

    const CheckIfReactionExists = await dbPromise.query("SELECT * FROM feed_reactions WHERE post_id = ? AND post_type = ? AND user_id = ?", [post_id, post_type, userId])
    if(CheckIfReactionExists[0].length > 0){
        const reactionId = CheckIfReactionExists[0][0].id
        const UpdateReaction = await dbPromise.query("UPDATE feed_reactions SET reaction_type = ? WHERE id = ?", [reactionType, reactionId])
        if(UpdateReaction[0].affectedRows > 0){
            console.log("Reaction Updated")
            return res.json({success:"Reaction Updated"})
        }
    }
    const SaveReaction = await dbPromise.query("INSERT INTO feed_reactions (post_id, post_type, user_id, reaction_type, username) VALUES (?, ?, ?, ?, ?)", [post_id, post_type, userId, reactionType, userName])
    if(SaveReaction[0].affectedRows > 0){
        console.log("Reaction Saved")
        return res.json({success:"Reaction Saved"})
    }
    return res.json({error:"Reaction Not Saved"})
}catch(error){
    console.log(error)
    return res.json({error:error.message})
}
}


module.exports = saveReaction