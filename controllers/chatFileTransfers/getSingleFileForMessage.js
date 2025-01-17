const db = require("../../routes/db.config")

const getSingleFileForMessage = async (req,res) =>{
    try{
    const {messageId} = req.body
    db.query("SELECT * FROM chat_files WHERE message_id = ? ", [messageId], async(err, data) =>{
        if(err){
            return res.json({error:err})
        }else{
            return res.json({success:"files available", files:data})
        }
    })
    }catch(error){
        return res.json({error:error.message})
    }
}


module.exports = getSingleFileForMessage