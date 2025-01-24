const db = require("../../routes/db.config");
const generateID = require("../admin/generateId");

const saveSpaceMessage = async (req,res) =>{
try{
    const data = req.body 
    const content = data.message;
    const senderId = data.name;
    const timestamp = data.dateTime;

    // Save the message to the database with the group chat room ID
    const buffer_id = data.inbox
    const messageId = await generateID()


    
    const query = "INSERT INTO spaces_messages (sender_id, content, timestamp, buffer, message_id) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [senderId, content, timestamp, buffer_id, messageId], (err, results) => {
      if (err) {
        console.error("Error saving message to the database:", err);
      } else {
        return res.json({success:"Message Saved"})
    // Emit the message to all users in the group chat
      }
    });
  
}catch(error){
    console.log(error)
    return res.json({error:error.messsage})
}
}


module.exports = saveSpaceMessage