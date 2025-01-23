const db = require("../../routes/db.config")

const AllChatFiles = async (req,res) =>{
    try{
      const {chatId} = req.body
    db.query("SELECT * FROM chat_files WHERE chat_id = ? ORDER BY id DESC", [chatId], async(err, data)=>{
        if(err){
            console.log(err)
            return res.json({error:err})
        }else{
            return res.json({success:"Chat Files Available", chatFiles:data})
        }
    })
    }catch(error){
        console.log(error)
        return res.json({error:error.message})
    }

}


module.exports = AllChatFiles