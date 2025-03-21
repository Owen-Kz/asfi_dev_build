const db = require("../../routes/db.config");
const generateID = require("../admin/generateId");
const sendNewMessageNotification = require("../notifications/newMessageNotification");
const saveMessageNotification = require("../scholarContols/saveMessageNotification");
const findUserByName = require("../services/findUser");
const fetchSpaceData = require("./fetchSpaceData");

const saveSpaceMessage = async (req, res) => {
  try {
    const { message: content, name: senderId, dateTime: timestamp, inbox: buffer_id } = req.body;

    // Generate message ID
    const messageId = await generateID();

    // Save message to database
    const query = "INSERT INTO spaces_messages (sender_id, content, timestamp, buffer, message_id) VALUES (?, ?, ?, ?, ?)";
    await new Promise((resolve, reject) => {
      db.query(query, [senderId, content, timestamp, buffer_id, messageId], (err) => {
        if (err) {
          console.error("Error saving message to the database:", err);
          return reject(err);
        }
        resolve();
      });
    });

    // Fetch space details
    const spaceData = await fetchSpaceData(buffer_id);
    let spaceTitle = spaceData?.space_focus || "Unknown Space";
    let spaceCover = spaceData?.space_cover || "https://res.cloudinary.com/dll8awuig/image/upload/v1705444097/dc69h8mggh01bvlvbowh.jpg";

    // Fetch sender's data once
    const senderData = await findUserByName(senderId);
    const senderName = `${senderData.first_name} ${senderData.last_name}`;
    const senderPhoto = senderData.profile_picture && senderData.profile_picture !== "avatar.jpg"
      ? senderData.profile_picture
      : "https://res.cloudinary.com/dll8awuig/image/upload/v1705444097/dc69h8mggh01bvlvbowh.jpg";

    // Fetch all recipients in parallel
    const recipients = await new Promise((resolve, reject) => {
      db.query(
        "SELECT username FROM space_participants WHERE space_id = ? AND username != ?",
        [buffer_id, senderId],
        (err, results) => {
          if (err) {
            console.error("Error fetching group chat users:", err);
            return reject(err);
          }
          resolve(results.map(user => user.username));
        }
      );
    });

    if (recipients.length === 0) return res.json({ success: "Message Saved (No recipients found)" });

    // Fetch recipient data in parallel
    const recipientDataList = await Promise.all(recipients.map(findUserByName));

    // Prepare notifications
    const notifications = recipientDataList.map(async (userData) => {
      const notificationToken = userData.notification_token;
      const recipientId = userData.username;
      const endpoint = `/spaces/${buffer_id}`;
      
      await saveMessageNotification(senderId, recipientId, `New Message from ${senderName} in ${spaceTitle}`, spaceCover, endpoint);
      await sendNewMessageNotification(senderId, notificationToken);
    });

    // Execute notifications concurrently
    await Promise.all(notifications);

    return res.json({ success: "Message and notifications sent successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = saveSpaceMessage;
