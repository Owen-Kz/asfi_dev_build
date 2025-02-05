const db = require("../../routes/db.config");
const generateID = require("../admin/generateId");
const sendNewMessageNotification = require("../notifications/newMessageNotification");
const saveMessageNotification = require("../scholarContols/saveMessageNotification");
// const saveNotification = require("../scholarContols/saveNotification");
const findUserByName = require("../services/findUser");

const saveMessage = async (req, res) => {
    try{
    const {  inbox, receiver, name, dateTime, message, recipient, sender} = req.body

    const recipientId = receiver;
    const content = message; 
    const senderId = name;
    const timestamp = dateTime;

    const buffer_id = inbox
    const messageId = await generateID()


    
    
    // chatId, text, receiver, timestamp
  
    const query = "INSERT INTO messages (sender_id, recipient_id, content, timestamp, buffer, message_id) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(query, [sender, receiver, message, timestamp, inbox, messageId], async (err, results) => {
      
      if (err) {
        console.error("Error saving message to the database:", err);
        throw err
      } 
    });
    
        
        const userData = await findUserByName(recipientId)
    
        const notificationToken = userData.notification_token

        let userPhoto = ""

        const senderData = await findUserByName(senderId)

        if(senderData.profile_picture && senderData.profile_picture != "avatar.jpg" && senderData.profile_picture != null ){
          userPhoto = senderData.profile_picture
        }else{
          userPhoto = "https://res.cloudinary.com/dll8awuig/image/upload/v1705444097/dc69h8mggh01bvlvbowh.jpg"
        }
   
        let maxLength = 10
        var limitedText = content;
        if (limitedText.length > maxLength) {
            limitedText = limitedText.substring(0, maxLength) + "...";
        }
        const Endpoint = `/@${senderId}/chat`
        await saveMessageNotification(senderId, recipientId, `New Message from ${senderData.first_name} ${senderData.last_name}. ${limitedText}`, userPhoto, Endpoint)
        await sendNewMessageNotification(senderId, notificationToken)
}catch(error){
    console.log(error)
    return res.json({error:error.message})
}
}

module.exports = saveMessage