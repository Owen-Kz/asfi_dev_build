const db = require("../../routes/db.config");
const generateID = require("../admin/generateId");
const sendNewMessageNotification = require("../notifications/newMessageNotification");
const saveMessageNotification = require("../scholarContols/saveMessageNotification");
const findUserByName = require("../services/findUser");
const fetchSpaceData = require("./fetchSpaceData");

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
    db.query(query, [senderId, content, timestamp, buffer_id, messageId], async (err, results) => {
      if (err) {
        console.error("Error saving message to the database:", err);
      } else {
        // fetch space Data 
        const spaceData = await fetchSpaceData(buffer_id)
     
        let spaceTitle = spaceData.space_focus
        let spaceCover = spaceData.space_cover
  
        if(spaceCover == "" || spaceCover == null || spaceCover == "cover.jpg"){
            spaceCover = "https://res.cloudinary.com/dll8awuig/image/upload/v1705444097/dc69h8mggh01bvlvbowh.jpg"
        }
        // Fetch all users in the group chat
        const query = "SELECT * FROM space_participants WHERE space_id = ? AND username != ?";
        db.query(query, [buffer_id, senderId], async (err, results) => {
          if (err) {
            console.error("Error fetching group chat users:", err);
          } else {
            // Save the message notification for each user in the group chat
            for (const user of results) {
              const recipientId = user.username;
              
              const userData = await findUserByName(recipientId)
              const notificationToken = userData.notification_token
              let userPhoto = ""
              const senderData = await findUserByName(senderId)
              if(senderData.profile_picture && senderData.profile_picture != "avatar.jpg" && senderData.profile_picture != null ){
                userPhoto = senderData.profile_picture
              }else{
                userPhoto = "https://res.cloudinary.com/dll8awuig/image/upload/v1705444097/dc69h8mggh01bvlvbowh.jpg"
              }
              const Endpoint = `/spaces/${buffer_id}`
             
              await saveMessageNotification(senderId, recipientId, `New Message from ${senderData.first_name} ${senderData.last_name} in ${spaceTitle}`, spaceCover, Endpoint)
              await sendNewMessageNotification(senderId, notificationToken)
            }
         }
      })
          
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