console.log("SERVER SIDE CHAT WORKING")


const db = require("../routes/db.config");
const bcrypt = require("bcryptjs");
const ChatBufferID = [];
const recentMessagesArray = [];


const PrivateChatRoom = async (req, res)=> {
  // if (req.user) {

    const senderUsername = "req.user.usernam";
    const recipientUsername = req.params["username"];
    const messageHistory = [];
    const bufferGenerated = await bcrypt.hash(senderUsername + recipientUsername, 8);
    const recentMessages = [];
    const receiverPoints = [];

    // try {
      // const chatBufferExists = await checkChatBufferExists(senderUsername, recipientUsername, bufferGenerated);
      console.log("CHAT WORKS")
      // const profiles = await fetchProfileInfo(senderUsername, recipientUsername);

      // const messageHistory = await fetchMessageHistory(senderUsername, recipientUsername);

      res.render("error.ejs", {
      
        status: "loggedIn",
        recipient: "recipientUsername",
        sender: "senderUsername",
        senderImage: "receiverPoints[0].sender_image",
        receiverFirstName: "receiverPoints[0].receiver_first_name",
        receiverLastname: "receiverPoints[0].receiver_last_name",
        senderFirstname: "receiverPoints[0].sender_first_name",
        senderLastname:" receiverPoints[0].sender_last_name",
        receiverImage: "receiverPoints[0].receiver_image",
        recent_message_recipient: JSON.stringify([]),
        chatHistory: JSON.stringify(messageHistory),
        ChatBufferID: JSON.stringify(ChatBufferID),
      });
    // } 
    // catch () {
      // console.log("Error:", error);
      // res.status(500).json({message:"Chats Could not be loaded"});
    // }
  // }
};

module.exports = PrivateChatRoom;
