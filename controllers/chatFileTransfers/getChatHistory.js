const db = require("../../routes/db.config");

const fetchChatHistory = async (req,res) =>{
    try{
        const {ChatId }= req.body
      
        const query = "SELECT * FROM messages WHERE buffer = ? ORDER BY id ASC";
        db.query(query, [ChatId], (err, results) => {
          if (err) { 
            console.log(err)
            throw err
          }else if(results){
            return res.json({success:"Chat History", history:results})
          }
        })
    }catch(error){
        console.log(error)
        res.json({error:error.message})
    }
}


module.exports = fetchChatHistory