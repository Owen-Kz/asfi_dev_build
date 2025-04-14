const fs = require("fs");
const path = require("path");
const saveNotification = require("../scholarContols/saveNotification");
const sendEmail = require("../utils/sendEmail");
const sendBody = require("./sendBody");
const db = require("../../routes/db.config");

const logError = (error, source) => {
    const logFile = path.join(__dirname, "errors.txt");
    const timestamp = new Date().toISOString();
    const errorMessage = `[${timestamp}] Error in ${source}: ${error.message}\n`;
    fs.appendFile(logFile, errorMessage, (err) => {
        if (err) console.error("Failed to log error:", err);
    });
};


const NewAnnouncementNotification = async (req, res, message, endpoint) => {
    try {

                    db.query("SELECT * FROM user_info WHERE 1", async (err, data) => {
                        if (err) {
                            console.log(err)
                            logError(err, "Fetching user_info");
                            return;
                        }
                        const userPhoto = `https://asfischolar.org/assets/images/ASFIScholar_Logo.png`;
                    
                        if (data[0]) {
                            const isAnnouncement = "yes"
                            await saveNotification(req.admin.username, req.admin.id, message, userPhoto, endpoint, isAnnouncement);
                            data.forEach(async user => {

                            
                            try {
                                const { notification_token:notification_token, id: userID, email:useremail } = user;
                                
                                if (notification_token && notification_token !=null && notification_token != undefined) {
                                    const notificationData = {
                                        title: `Important`,
                                        message: `${message}`,
                                        token: notification_token,
                                    };
                                    await sendBody(notificationData);
                                }
                                
                                const senderFullname = `Special Announcement`;
                                const subject = `${senderFullname} on ASFI Scholar`;
                                const emailMessage = `<p>An Announcement was made on ASFIScholar</p> 
                                <p> "${message}" </p>
                                <a href=${endpoint}>Click her to view</a></p>`
                            
                                
                                await sendEmail(useremail, subject, emailMessage);
                            } catch (error) {
                                console.log(error)
                                logError(error, "Processing notification");
                            }
                        })
                        }
                    });
                
            
    
    } catch (error) {
        console.log(error)
        logError(error, "Main function");
    }
};

module.exports = NewAnnouncementNotification;
