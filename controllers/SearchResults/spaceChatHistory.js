const db = require("../../routes/db.config");

const SpaceChatHistory = (req, res) => {
    let ChatHistoryArray = [];
    let queryCount = 0;

    const SpaceId = req.params.spaceid;
    db.query("SELECT * FROM spaces_messages WHERE ? ORDER BY timestamp ASC", [{ buffer: SpaceId }], (err, history) => {
        if (err) {
            console.error("Error retrieving chat history:", err);
            res.status(500).json({ error: "Could not retrieve chat History" });
        }

        if (history) {
            history.forEach(chatContent => {
                const sender_username = chatContent.sender_id;
                const message_content = chatContent.content;
                const timeStamp = chatContent.timestamp;

                db.query("SELECT * FROM user_info WHERE username = ?", [sender_username], (err, userData) => {
                    if (err) throw err;
                    if (userData[0]) {
                        const username_data = userData[0].username;
                        const Profile_picture = userData[0].profile_picture;
                        const Fullname = `${userData[0].first_name} ${userData[0].last_name}`;
                        ChatHistoryArray.push({
                            sender_id: sender_username,
                            senderProfilePicture: Profile_picture,
                            senderFullname: Fullname,
                            content: message_content,
                            timestamp: timeStamp
                        });

                        queryCount++;

                        // Check if all queries have completed
                        if (queryCount === history.length) {
                            res.status(200).json({ spaceChatHistory: JSON.stringify(ChatHistoryArray) });
                        }
                    }
                });
            });
        }
    });
};

module.exports = SpaceChatHistory;
