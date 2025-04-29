const dbPromise = require("../../routes/dbPromise.config")

const getReactions = async (req,res) =>{
try{
    const {post_id, post_type} = req.body 

    const CheckIfReactionExists = await dbPromise.query("SELECT * FROM feed_reactions WHERE post_id = ? AND post_type = ? AND user_id = ?", [post_id, post_type, req.user.id])
    const CountReactions = await dbPromise.query("SELECT COUNT(*) as count FROM feed_reactions WHERE post_id = ? AND post_type = ?", [post_id, post_type])
    const reaction_count = CountReactions[0][0].count || 0
    if(CheckIfReactionExists[0].length > 0){
        return res.json({success:"Reaction Exists", reaction_type:CheckIfReactionExists[0][0].reaction_type, reaction_count})
    }else{
        return res.json({success:"Reaction Exists", reaction_type:"", reaction_count})

        // return res.json({error:"No Reaction Found"})
    }
}catch(error){
    return res.json({error:error.message})
}
}

module.exports = getReactions