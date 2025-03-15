const fs = require("fs");
const path = require("path");
const saveNotification = require("../scholarContols/saveNotification");
const sendEmail = require("../utils/sendEmail");
const sendBody = require("./sendBody");

const logError = (error, source) => {
    const logFile = path.join(__dirname, "errors.txt");
    const timestamp = new Date().toISOString();
    const errorMessage = `[${timestamp}] Error in ${source}: ${error.message}\n`;
    fs.appendFile(logFile, errorMessage, (err) => {
        if (err) console.error("Failed to log error:", err);
    });
};

const newPostNotification = async (req, res, message, endpoint) => {
    try {
        const username = req.user.username;
        db.query("SELECT * FROM followers WHERE followingUsername = ? ORDER BY id DESC", [String(username)], async (err, followers) => {
            if (err) {
                logError(err, "Fetching followers");
                return;
            }

            if (followers.length > 0) {
                followers.forEach((element) => {
                    db.query("SELECT * FROM user_info WHERE username = ?", [element.followerUsername], async (err, data) => {
                        if (err) {
                            logError(err, "Fetching user_info");
                            return;
                        }
                        
                        if (data.length > 0) {
                            try {
                                const { notification_token, id: userID, email: useremail } = data[0];
                                
                                if (notification_token) {
                                    const notificationData = {
                                        title: `New Post Notification`,
                                        message: `${message}`,
                                        token: notification_token,
                                    };
                                    await sendBody(notificationData);
                                }
                                
                                const senderFullname = `${req.user.first_name} ${req.user.last_name}`;
                                const userPhoto = `${req.user.profile_picture}`;
                                const subject = `${senderFullname} Just made a post`;
                                const emailMessage = `<p>${senderFullname} ${message}</p>`;
                                
                                await saveNotification(req.user.username, userID, subject, userPhoto, endpoint);
                                // await sendEmail(useremail, subject, emailMessage);
                            } catch (error) {
                                logError(error, "Processing notification");
                            }
                        }
                    });
                });
            }
        });
    } catch (error) {
        logError(error, "Main function");
    }
};

module.exports = newPostNotification;
