const db = require("../routes/db.config");

const updateAccount = async (req, res) => {
    if(req.user){
        const  usernameValidator_main = req.user.username
        const AccountType = req.user.acct_type
    const { firstname, lastname, username, phonenumber, title, bio, ID_Validator, gender, NewLocation } = req.body;

    try {
        const success = [];
        if (usernameValidator_main) {
            db.query("SELECT * FROM user_info WHERE ID = ? AND phonenumber = ? AND bio = ? AND first_name = ? AND last_name = ? AND title = ? AND gender = ? AND home_address = ?", 
            [ID_Validator, phonenumber, bio, firstname, lastname, title, gender, NewLocation], async (err, exists) => {
                if (err) throw err
                if (exists[0]) {
                    res.json({ message: "Data has not changed" });
                }        
                });
            }

            let responseSent = false;  // Flag to track if the response has been sent

            const updateUserField = async (field, value, successMessage) => {
                if (value !== "") {
                    db.query("UPDATE user_info SET ? WHERE ID =?", [{ [field]: value }, ID_Validator], async(err, newdata) => {
                        if (err) throw err;

                        if (newdata && !responseSent) {  // Check if the response hasn't been sent yet
                            success.push(successMessage);
            
                            responseSent = true;  // Set the flag to true
                            res.json({ message: "Profile Updated Successfully" });  // Send the JSON response
                        }
                    });
                }
            };

            // Update all the data tables when the username changes 
            const updateUserNameFields =  async (table, validator, field, value, successMessage) => {
                if (value !== "") {
                    db.query(`UPDATE ${table} SET ? WHERE ${validator} =?`, [{ [field]: value }, usernameValidator_main], async(err, newdata) => {
                        if (err) throw err;

                        if (newdata && !responseSent) {  // Check if the response hasn't been sent yet
                            success.push(successMessage);
                            // console.log(successMessage)
            
                            // responseSent = true;  // Set the flag to true
                            // res.json({ message: "Profile Updated Successfully" });  // Send the JSON response
                        }
                    });
                }
            };

            // UPDATE the tables containing fullname when the firstname or lastname Changes 
            const updateFulnameFields =  async (table, validator, field, value, successMessage) => {
                if (value !== "") {
                    db.query(`UPDATE ${table} SET ? WHERE ${validator} =?`, [{ [field]: value }, usernameValidator_main], async(err, newdata) => {
                        if (err) throw err;

                        if (newdata && !responseSent) {  // Check if the response hasn't been sent yet
                            success.push(successMessage);
                            // responseSent = true;  // Set the flag to true
                            // res.json({ message: "Profile Updated Successfully" });  // Send the JSON response
                        }
                    });
                }
            };


        if (phonenumber !== "") {
            db.query("SELECT *  FROM user_info WHERE ID  =? AND phonenumber =?", [ID_Validator, phonenumber], async (err, phone) => {
                if (err) throw err
                if (phone[0]) {
                    console.log("Phonenumber did not change")
                } else {
                    await updateUserField("phonenumber", phonenumber, "Phonenumber updated");
                }
            })
        }

        if (firstname !== "") {
            db.query("SELECT *  FROM user_info WHERE ID  =? AND first_name =?", [ID_Validator, firstname], async (err, firstname_) => {
                if (err) throw err
                if (firstname_[0]) {
                    console.log("Firstname did not change")
                } else {
                    await updateUserField("first_name", firstname, "Firstname updated");

                    await updateFulnameFields("applied_courses", "participants_username", "participants_fullname", firstname +" "+ lastname, "External Link updated")
                    await updateFulnameFields("external_links", "link_owner", "link_owner_fullname", `${firstname +" "+ lastname}`,"External Link updated")
                    await updateFulnameFields("podcasts", "podcast_owner", "podcast_owner_fullname", `${firstname +" "+ lastname}`, "Podcast updated")                
                    
                    
                }
            })
        }

        if (lastname !== "") {

            db.query("SELECT *  FROM user_info WHERE ID  =? AND last_name =?", [ID_Validator, lastname], async (err, lastname_) => {
                if (err) throw err
                if (lastname_[0]) {
                    console.log("Lastname did not change")
                } else {
                    await updateUserField("last_name", lastname, "Lastname updated");
                    await updateFulnameFields("applied_courses", "participants_username", "participants_fullname", firstname +" "+ lastname, "External Link updated")
                    await updateFulnameFields("external_links", "link_owner", "link_owner_fullname", `${firstname +" "+ lastname}`,"External Link updated")
                    await updateFulnameFields("podcasts", "podcast_owner", "podcast_owner_fullname", `${firstname +" "+ lastname}`, "Podcast updated")  

                }
            })
        }

        if(bio !==""){
            db.query("SELECT *  FROM user_info WHERE ID  =? AND bio =?", [ID_Validator, bio], async (err, bio_) => {
                if (err) throw err
                if (bio_[0]) {
                    console.log("Bio did not change")
                } else {
                    await updateUserField("bio", bio, "Bio updated");
                }
            })
        }

        if(title !== ""){
            db.query("SELECT *  FROM user_info WHERE ID  =? AND title =?", [ID_Validator, title], async (err, title_) => {
                if (err) throw err
                if (title_[0]) {
                    console.log("Title did not change")
                } else {
                    await updateUserField("title", title, "Title updated");
                }
            })
        }

        if(gender !== ""){
            db.query("SELECT * FROM user_info WHERE ID  =? AND gender =?", [ID_Validator, title], async (err, gender_) => {
                if (err) throw err
                if (gender_[0]) {
                    console.log("Gender did not change")
                } else {
                    await updateUserField("gender", gender, "Gender updated");

                }
            })
        }

        
        if(NewLocation !== ""){
            db.query("SELECT * FROM user_info WHERE ID  =? AND home_address =?", [ID_Validator, NewLocation], async (err, address) => {
                if (err) throw err
                if (address[0]) {
                    console.log("Address did not change")
                } else {
                    await updateUserField("home_address", NewLocation, "Home address updated");

                }
            })
        } 

        if (username !== "") {
            db.query("SELECT * FROM user_info WHERE username =?", username, async (err, data) => {
                if (err) throw err
                if (data[0]) {
                    if(data[0].username != usernameValidator_main){
                    responseSent = true
                    res.json({message:"Username Already taken"})
                    }
                } else {
                    await updateUserField("username", username, "Username updated");

                    if(AccountType == "instructor_account"){
                    await updateUserNameFields("applied_courses", "course_instructor_username", "course_instructor_username", username, "Apllied Courses Updated")
                    await updateUserNameFields("asfi_courses", "course_instructor", "course_instructor", username, "Courses Updated")
                    await updateUserNameFields("books", "book_author", "book_author", username, "Books Updated")
                    await updateUserNameFields("external_links", "link_owner", "link_owner", username, "Links Updated")
                    await updateUserNameFields("tutorials", "tutorial_owner", "tutorial_owner", username, "Links Updated")
                    await updateUserNameFields("course_reviews", "course_owner_username", "course_owner_username", username, "Reviews Updated")
                    }
                    else{
                    await updateUserNameFields("applied_courses", "participants_username", "course_instructor_username", username, "Apllied Courses Updated")
                  
                    await updateUserNameFields("course_reviews", "reviewer_name", "reviewer_name", username, "Reviews Updated")
                    }

                    await updateUserNameFields("chat_buffer", "user_two", "user_two", username, "Chat Buffer Updated")
                    await updateUserNameFields("chat_buffer", "user_one", "user_one", username, "Chat Buffer Updated")

                    await updateUserNameFields("followers", "followerUsername", "followerUsername", username, "followers Updated")
                    await updateUserNameFields("followers", "followingUsername", "followingUsername", username, "followers Updated")

                    await updateUserNameFields("social_links", "link_owner", "link_owner", username, "Social Links Updated")
                    await updateUserNameFields("honoraries", "scholar_username", "scholar_username", username, "Honoraries Updated")

                    await updateUserNameFields("messages", "recipient_id", "recipient_id", username, "MessagesUpdated")
                    await updateUserNameFields("messages", "sender_id", "sender_id", username, "MessagesUpdated")

                    await updateUserNameFields("podcasts", "podcast_owner", "podcast_owner", username, "Links Updated")
                    await updateUserNameFields("space_participants", "username", "username", username, "Links Updated")

                    await updateUserNameFields("spaces_messages", "sender_id", "sender_id", username, "Links Updated")

                    await updateUserNameFields("awards_honors", "award_owner_username", "award_owner_username", username, "Awards updated")

                    await updateUserNameFields("scholar_work_history", "work_owner_username", "work_owner_username", username, "Work History updated")

                     await updateUserNameFields("technical_expertise", "skill_owner_username", "skill_owner_username", username, "Work History updated")

                }
            })
        }
    } catch (error) {
        console.error("Error updating account:", error);
        res.status(500).json({ message: "An error occurred while updating account" });
    }
}

};

module.exports = updateAccount;
