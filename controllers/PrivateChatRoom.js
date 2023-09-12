const db = require("../routes/db.config");
const bcrypt = require("bcryptjs");
const ChatBufferID = [];
const recentMessagesArray = [];

const PrivateChatRoom = async(req,res) =>{
  const senderUsername = req.user.username;
  const recipientUsername = req.params["rec_username"];

  res.render("chats", {
    status: "loggedIn",
    recipient: recipientUsername,
    sender: senderUsername,
    senderImage: "receiverPoints[0].sender_image",
    receiverFirstName: "receiverPoints[0].receiver_first_name",
    receiverLastname: "receiverPoints[0].receiver_last_name",
    senderFirstname: "receiverPoints[0].sender_first_name",
    senderLastname: "receiverPoints[0].sender_last_name",
    receiverImage: "receiverPoints[0].receiver_image",
    recent_message_recipient: "JSON.stringify(RECENT_MESSAGES)",
    chatHistory: "JSON.stringify(messageHistory)",
    ChatBufferID: "JSON.stringify(ChatBufferID)",
  });
}


module.exports = PrivateChatRoom;
