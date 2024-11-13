const db = require("../../routes/db.config")

const AllChatFiles = async (req,res) =>{
    try{
    const {chatId} = req.body
    db.query("SELECT * FROM chat_files WHERE chat_id = ?", [chatId], async(err, data)=>{
        if(err){
            return res.json({error:err})
        }else{
            return res.json({success:"Chat Files Available", chatFiles:data})
        }
    })
    }catch(error){
        return res.json({error:error})
    }

}


module.exports = AllChatFiles