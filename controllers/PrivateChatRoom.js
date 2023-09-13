const db = require("../routes/db.config");
const bcrypt = require("bcryptjs");
const ChatBufferID = [];
const recentMessagesArray = [];

console.log("SERVER SIDE CHAT WORKING")

const PrivateChatRoom = async (req, res) => {
  // if (req.user) {
    // Call this function when you start a new chat session
    startNewChatSession();
    const senderUsername = "req.user.usernam";
    const recipientUsername = req.params["username"];
    const messageHistory = [];
    const bufferGenerated = await bcrypt.hash(senderUsername + recipientUsername, 8);
    const recentMessages = [];
    const receiverPoints = [];

    try {
      const chatBufferExists = await checkChatBufferExists(senderUsername, recipientUsername, bufferGenerated);
      console.log("CHAT WORKS")
      const profiles = await fetchProfileInfo(senderUsername, recipientUsername);

      if (profiles.senderProfileInfo && profiles.recipientProfileInfo) {
        const senderProfileInfo = profiles.senderProfileInfo;
        const recipientProfileInfo = profiles.recipientProfileInfo;

        receiverPoints.push({
          receiver_first_name: recipientProfileInfo.first_name,
          receiver_last_name: recipientProfileInfo.last_name,
          receiver_image: recipientProfileInfo.profile_picture,
          sender_image: senderProfileInfo.profile_picture,
          sender_first_name: senderProfileInfo.first_name,
          sender_last_name: senderProfileInfo.last_name,
        });
      }
      var RECENT_MESSAGES
      const recentMessages = await fetchRecentMessages(senderUsername, recipientUsername)  .then(recentMessagesArray => {
         RECENT_MESSAGES = recentMessagesArray
    })
    .catch(error => {
        console.error("Error:", error);
    });
      
      const messageHistory = await fetchMessageHistory(senderUsername, recipientUsername);

      res.render("chats.ejs", {
        status: "loggedIn",
        recipient: recipientUsername,
        sender: senderUsername,
        senderImage: receiverPoints[0].sender_image,
        receiverFirstName: receiverPoints[0].receiver_first_name,
        receiverLastname: receiverPoints[0].receiver_last_name,
        senderFirstname: receiverPoints[0].sender_first_name,
        senderLastname: receiverPoints[0].sender_last_name,
        receiverImage: receiverPoints[0].receiver_image,
        recent_message_recipient: JSON.stringify(RECENT_MESSAGES),
        chatHistory: JSON.stringify(messageHistory),
        ChatBufferID: JSON.stringify(ChatBufferID),
      });
    } catch (error) {
      console.log("Error:", error);
      res.status(500).send("Chats Could not be loaded");
    }
  // }
};

module.exports = PrivateChatRoom;
