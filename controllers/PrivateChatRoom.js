const db = require("../routes/db.config");
const bcrypt = require("bcryptjs");
const ChatBufferID = [];
const recentMessagesArray = [];

console.log("SERVER SIDE CHAT WORKING")
const startNewChatSession = () => {
  ChatBufferID.length = 0; 
};



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
            ChatBufferID.push({ id: bufferResult[0]["buffer_generated"] });
            resolve(true);
          }
        );
      } else {
console.log("BUFFER CREATED")

        createChatBuffer(senderUsername, recipientUsername, bufferGenerated)
          .then(() => {
            ChatBufferID.push({ id: bufferGenerated });
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

    const fetchSenderProfileQuery = "SELECT * FROM user_info WHERE username = ?";
    db.query(fetchSenderProfileQuery, [senderUsername], (err, senderResult) => {
      if (err) return reject(err);
      profiles.senderProfileInfo = senderResult[0];

      const fetchRecipientProfileQuery = "SELECT * FROM user_info WHERE username = ?";
      db.query(fetchRecipientProfileQuery, [recipientUsername], (err, recipientResult) => {
        if (err) return reject(err);
        profiles.recipientProfileInfo = recipientResult[0];
        resolve(profiles);
      });
    });
  });
};

const fetchRecentMessages = async (senderUsername, recipientUsername) => {
  return new Promise((resolve, reject) => {
    console.log("FETCH RECENT")
      const query = `
          SELECT m.*
          FROM messages m
          JOIN (
              SELECT buffer, MAX(timestamp) AS max_timestamp
              FROM messages
              WHERE recipient_id = ? OR sender_id = ?
              GROUP BY buffer
          ) recent ON m.buffer = recent.buffer AND m.timestamp = recent.max_timestamp
      `;
      db.query(query, [senderUsername, senderUsername], async (err, recentMessages) => {
          if (err) return reject(err);

          const recentMessagesArray = recentMessages.map(message => ({
              Receiver: message.recipient_id,
              SentBy: message.sender_id,
              LastMessage: message.content,
              TimeStamp: message.timestamp
          }));
          resolve(recentMessagesArray);
      });
  });
};

const PrivateChatRoom = async (req, res) => {
  if (req.user) {
    // Call this function when you start a new chat session
    startNewChatSession();
    const senderUsername = req.user.username;
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
  }
};

module.exports = PrivateChatRoom;
