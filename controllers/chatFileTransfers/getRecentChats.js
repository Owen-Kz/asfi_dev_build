const db = require("../../routes/db.config");

const fetchRecentMessages = async (req, res) => {
    const senderUsername = req.user.username
    try{
    // return new Promise((resolve, reject) => {
      console.log("FETCH RECENT")
        const query = `
           WITH RankedMessages AS (     SELECT 
                        s.*,
                        ROW_NUMBER() OVER (
                            PARTITION BY s.buffer 
                            ORDER BY s.id DESC, s.id DESC
                        ) AS row_num
                    FROM messages s
                    WHERE s.sender_id = ? OR s.recipient_id =  ?
                )
                SELECT *
                FROM RankedMessages
                WHERE row_num = 1
                ORDER BY id DESC;
        `;
        db.query(query, [senderUsername, senderUsername], async (err, recentMessages) => {
            if (err) throw err
            const recentMessagesArray = recentMessages.map(message => ({
                Receiver: message.recipient_id,
                SentBy: message.sender_id,
                LastMessage: message.content,
                TimeStamp: message.timestamp,
                mainUser: req.user.username,
                buffer: message.buffer
            }));
           return res.json({success:"messages", recent:recentMessagesArray})

            
    //         resolve(recentMessagesArray);
    //     });
    });
}catch(error){
    console.log(error)
    return res.json({error:error.message})
}
  };


  module.exports = fetchRecentMessages