const db = require("../routes/db.config");

const chatHistory = async (req, res) => {
    const { senderId, receiverId } = req.query;
    
  
    const query =
      "SELECT * FROM messages WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?) ORDER BY timestamp ASC";
    
    db.query(query, [senderId, receiverId, receiverId, senderId], (err, results) => {
      if (err) {
        console.error("Error retrieving chat history:", err);
        res.status(500).json({ error: "An error occurred while fetching chat history" });
      } else {
        res.status(200).json(results);
      }
    });
  };

  module.exports = chatHistory
  