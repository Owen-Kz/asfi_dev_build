const db = require("../routes/db.config");
const bcrypt = require("bcryptjs");
const AdminLoggedIn = require("./admin/loggedin");
const ChatBufferID = [];
let bufferGeneratedMain = "";
let bufferID = "";
let callerID = ""; // Initialize callerID here  

const recentMessagesArray = [];

console.log("SERVER SIDE CHAT WORKING")
const startNewChatSession = () => {
  ChatBufferID.length = 0; 
};

async function processHashedValue(buffer) {
  
  // Remove all slashes from the hash
  const sanitizedHash = buffer.replace(/\//g, '');

  // Get last 5 and first 5 characters
  const result = sanitizedHash.slice(-5) + sanitizedHash.slice(0, 5);

  return result;
}

const checkChatBufferExists = async (senderUsername, recipientUsername, bufferGenerated) => {
console.log("BUFFER EXISTS")
  return new Promise((resolve, reject) => {
    const query = "SELECT COUNT(*) AS chat_exists_count FROM chat_buffer WHERE (user_one = ? AND user_two = ?) OR (user_one = ? AND user_two = ?)";
    db.query(query, [senderUsername, recipientUsername, recipientUsername, senderUsername], (err, result) => {
      if (err) return reject(err);

      if (result[0]["chat_exists_count"] > 0) {
        // Chat buffer exists, so fetch the buffer ID
        db.query("SELECT buffer_generated FROM chat_buffer WHERE (user_one = ? AND user_two = ?) OR (user_one = ? AND user_two = ?)",
          [senderUsername, recipientUsername, recipientUsername, senderUsername],
          (err, bufferResult) => {
            if (err) return reject(err);            
            // Push the buffer ID into the ChatBufferID array
            // ChatBufferID.push({ id: bufferResult[0]["buffer_generated"] });
            bufferID = bufferResult[0]["id"];
            bufferGeneratedMain = bufferResult[0]["buffer_generated"]
            resolve(true);
          }
        );
      } else {
console.log("BUFFER CREATED")

        createChatBuffer(senderUsername, recipientUsername, bufferGenerated)
          .then(() => {
            // ChatBufferID.push({ id: bufferGenerated });
            bufferGeneratedMain = bufferGenerated
            resolve(true); // Resolve the promise after creating the chat buffer
          })
          .catch((err) => {
            reject(err); // Reject the promise if there's an error
          });
      }
      
    });
  });
};

const createChatBuffer = async (senderUsername, recipientUsername, bufferGenerated) => {
  
  return new Promise((resolve, reject) => {
    const createChatBufferQuery = "INSERT INTO chat_buffer (user_one, user_two, chat_type, buffer_generated) VALUES (?, ?, ?, ?)";
    db.query(createChatBufferQuery, [senderUsername, recipientUsername, "private_chat", bufferGenerated], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const fetchMessageHistory = async (senderUsername, recipientUsername) => {
console.log("FETCH MESSAGE HISTORY")

  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM messages WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?) ORDER BY timestamp ASC";
    db.query(query, [senderUsername, recipientUsername, recipientUsername, senderUsername], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const fetchProfileInfo = async (senderUsername, recipientUsername) => {
  console.log("FETCH PROFILE INFO")
  return new Promise((resolve, reject) => {
    const profiles = {};

    const fetchSenderProfileQuery = "SELECT * FROM user_info WHERE username = ? OR email = ?";
    db.query(fetchSenderProfileQuery, [senderUsername, senderUsername], (err, senderResult) => {
      if (err) return reject(err);
      profiles.senderProfileInfo = senderResult[0];

      const fetchRecipientProfileQuery = "SELECT * FROM user_info WHERE username = ? OR email = ?";
      db.query(fetchRecipientProfileQuery, [recipientUsername, recipientUsername], (err, recipientResult) => {
        if (err) return reject(err);
        profiles.recipientProfileInfo = recipientResult[0];
        resolve(profiles);
      });
    });
  });
};



const ChatInChat = async (req, res) => {

  if(req.user){
  // if (req.user || req.admin) {
  let senderUsername  
  if(req.query.admin){

    const Buffer = req.query.admin
    // db.query("SELECT * FROM user_info WHERE buffer = 'AGentEKYO' ", async (er, data) => {
    //   if(er) throw er
    //   console.log(data)

      // if(data){
        senderUsername = "admin_weperch"
      // }
    // })
    }else{
 senderUsername = req.user.username;
    }

    // Call this function when you start a new chat session
    startNewChatSession();
    const recipientUsername = req.params["username"];
    const messageHistory = [];
    bufferID = recipientUsername + senderUsername;
    bufferGeneratedMain = await bcrypt.hash(senderUsername + recipientUsername, 8);
    const recentMessages = [];
    const receiverPoints = [];
    callerID = bufferID + await processHashedValue(bufferGeneratedMain);

    try {
      const chatBufferExists = await checkChatBufferExists(senderUsername, recipientUsername, bufferGeneratedMain);
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
   
      var RECENT_MESSAGES = []
    //   const recentMessages = await fetchRecentMessages(senderUsername, recipientUsername)  .then(recentMessagesArray => {
    //      RECENT_MESSAGES = recentMessagesArray
    // })
    // .catch(error => {
    //     console.error("Error:", error);
    // });
      
      const messageHistory = await fetchMessageHistory(senderUsername, recipientUsername);
      console.log(bufferGeneratedMain)
      if(receiverPoints.length >0){
      res.render("app-chat-in-chat.ejs", {
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
        chat_id:bufferGeneratedMain,
        call_id: callerID,
        UserName:req.user.username, accountType:req.user.acct_type, FirstName:req.user.first_name, LastName: req.user.last_name, ProfileImage: req.user.profile_picture, Email:req.user.email, UserFirstname:req.user.first_name, UserLastName:req.user.last_name, Course:"Course", CourseYear:"CourseYer", username:req.user.username, Username:req.user.username, UserName:req.user.username
      });
      }else{

        res.render('error.ejs', {status: "No ASFI Scholar Account Associated with this Presenter", page:"#"})
      }
    } catch (error) {
      console.log("Error:", error);
      res.status(500).send("Chats Could not be loaded");
    }
  // }
  }else{
    res.render("loginExternal")
  }
};

module.exports = ChatInChat;
