const dbPromise = require("../../routes/dbPromise.config")

const saveReaction = async (req,res) =>{
try{
    const {reactionType, post_id, post_type} = req.body 
    const userId = req.user.id
    const userName = req.user.username 
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