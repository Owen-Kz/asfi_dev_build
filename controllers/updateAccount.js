const db = require("../routes/db.config");

const updateAccount = async (req, res) => {
    if(req.user){
        const  usernameValidator_main = req.user.username
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
