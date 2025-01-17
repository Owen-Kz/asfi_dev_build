const db = require("../../routes/db.config")

async function findRecipient(username){
 return new Promise((resolve, reject) =>{
  db.query("SELECT username, profile_picture, first_name, last_name, email FROM user_info WHERE username = ?", [username], async (err, user) =>{
      
        if(err){
            console.log(err)
            reject(err)
        }else if(user){
          resolve(user)
        }else{
            resolve([])
        }
    })
  })
}

const getChatUsers = async (req,res) =>{
    try{
    const username = req.user.username
    const {chat_id} = req.body 
    db.query("SELECT * FROM chat_buffer WHERE buffer_generated = ?", [chat_id], async(err, data) =>{
        if(err){
   
            throw err
        }else if(data[0]){
          
            
            if(data[0].user_two === req.user.username){
               const recipient = await findRecipient(data[0].user_one)
                return res.json({success:"recipieint", recipient})
            }else if(data[0].user_one === req.user.username){
               const recipient = await findRecipient(data[0].user_two)
                return res.json({success:"recipieint", recipient})
            }
            
        }
    })
    }catch(error){
        console.log(error)
        return res.json({error:error.message})
    }
}

module.exports = getChatUsers