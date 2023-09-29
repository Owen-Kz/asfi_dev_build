const db = require("../routes/db.config");
const fs = require('fs');

const DeleteAccountTrue = async (req, res) => {
    // console.log(req)
    if (req.query) {
        const { usernameDelete, bufferDelete, profilePhoto, coverPhoto } = req.query;
        // JSON.parse(req.body)
        console.log(req.query)

        // Define a function to handle deleting user data from different tables
        const deleteUserFromTables = async () => {
            try {
                // Delete data from the 'messages' table if applicable
                  db.query("DELETE FROM messages WHERE sender_id = ? OR recipient_id =?", [usernameDelete, usernameDelete]);

                // Delete data from the 'social_links' table if applicable
                  db.query("DELETE FROM external_links WHERE link_owner = ?", [usernameDelete]);

                  db.query("DELETE FROM social_links WHERE link_owner = ?", [usernameDelete]);

                  db.query("DELETE FROM comments WHERE comments_username = ?", [usernameDelete]);

                  db.query("DELETE FROM scholar_work_history WHERE work_owner_username = ?", [usernameDelete]);

                  db.query("DELETE FROM awards_honors WHERE award_owner_username = ?", [usernameDelete]);
                  db.query("DELETE FROM technical_expertise WHERE skill_owner_username = ?", [usernameDelete]);

                   db.query("DELETE FROM podcasts WHERE podcast_owner = ?", [usernameDelete]);

                   db.query("DELETE FROM books WHERE book_author = ?", [usernameDelete]);

                   db.query("DELETE FROM chat_buffer WHERE user_one = ? OR user_two =?", [usernameDelete, usernameDelete]);

                   db.query("DELETE FROM followers WHERE followerUsername = ? OR followingUsername =?", [usernameDelete, usernameDelete]);

                   db.query("DELETE FROM honoraries WHERE scholar_username = ?", [usernameDelete]);

                   db.query("DELETE FROM replies WHERE replier_username = ? OR comment_replied_to_username =?", [usernameDelete, usernameDelete]);

                   db.query("DELETE FROM tutorials WHERE tutorial_owner = ?", [usernameDelete]);




                // Repeat the above process for other tables as needed...

                // After deleting data from all relevant tables, proceed with other actions
                // Delete profile picture
                const profilePicturePath = __dirname + "/public/userUpload/profilePhotos/" + profilePhoto;
                const coverPicturePath = __dirname + "/public/userUpload/profileCovers/" + coverPhoto;

                fs.unlink(profilePicturePath, (err) => {
                    if (err) {
                        console.error('Error deleting profile picture:', err);
                        // Handle the error, perhaps by sending an error response to the user.
                    } else {
                        console.log('Profile picture deleted');
                        // Continue with the next step, deleting cover photo.
                        fs.unlink(coverPicturePath, (err) => {
                            if (err) {
                                console.error('Error deleting cover picture:', err);
                            } else {
                                console.log('Cover picture deleted');
                            }
                            // Redirect to logout or perform other necessary actions
                            res.redirect("/logout");
                        });
                    }
                });
            } catch (err) {
                console.error('Error deleting user data:', err);
                // Handle the error, perhaps by sending an error response to the user.
            }
        };

        // Delete data from the 'user_info' table
        db.query("DELETE FROM user_info WHERE username = ? AND buffer = ?", [usernameDelete, bufferDelete], (err, result) => {
            if (err) {
                console.error('Error deleting user_info data:', err);
                // Handle the error, perhaps by sending an error response to the user.
            } else {
                console.log('User data deleted from user_info table');
                // Proceed with deleting data from other tables
                deleteUserFromTables();
                res.clearCookie('userRegistered');

                res.redirect("/home")
            }
        });
    }
};

module.exports = DeleteAccountTrue;
