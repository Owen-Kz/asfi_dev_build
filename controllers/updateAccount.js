const db = require("../routes/db.config");
const bcrypt = require("bcryptjs");
const validator = require("validator");


const updateAccount = async (req, res) => {
    const { firstname, lastname, username, phonenumber, usernameValidator, title, bio, ID_Validator, gender, NewLocation} = req.body

// res.json({message:'dataREcieved'})

    if(usernameValidator) {
        db.query("SELECT * FROM user_info WHERE ? AND ? AND ? AND ? AND ? AND ? AND ? AND ?", [{first_name:firstname}, {last_name:lastname},{bio:bio},  {username:username}, {phonenumber:phonenumber}, {gender:gender}, {home_address:NewLocation},{title:title}], async (er_no_Change, no_change) => {
            if(er_no_Change){ throw er_no_Change}

            if(no_change[0]){
            const  oldNumber__ = no_change[0]["phonenumber"]
            const  oldFirstName__ = no_change[0]["first_name"]
             const oldLastName__ = no_change[0]["last_name"]
            const  oldUsername__ = no_change[0]["username"]

            // console.log(oldFirstName__, oldLastName__, oldNumber__, oldUsername__)
            res.json({message: "No changes was detected"})
            }
            else{
        const success = []
    // Update phonenumber only 
    if(phonenumber != ""){
    db.query("UPDATE user_info SET ? WHERE username =?", [{phonenumber:phonenumber}, usernameValidator], async(errP, PhoneUpdate) => {
        if(errP) throw errP
        success.push(
            "phonenumber updated"
            )

    })
    }

    // Update firstname only 
    if(firstname != ""){
        db.query("UPDATE user_info SET ? WHERE username =?", [{first_name:firstname}, usernameValidator], async(errP, FirstNameUpdated) => {
            if(errP) throw errP
            // res.json({message:"firstname Updated Successfully"})
            success.push(
                "Firstname Updated"
                )
        })
    }

    // Update Lastname only 
    if(lastname != ""){
        db.query("UPDATE user_info SET ? WHERE username =?", [{last_name:lastname}, usernameValidator], async(errP, lastNameUPdated) => {
            if(errP) throw errP
            // res.json({success:"Lastname Updated Successfully"})
            success.push(
                "Lastname updated"
                )
        })
    }

    if(bio != ""){
        db.query("UPDATE user_info SET ? WHERE username =?", [{bio:bio}, usernameValidator], async(errP, lastNameUPdated) => {
            if(errP) throw errP
            // res.json({success:"Lastname Updated Successfully"})
            success.push(
                "Lastname updated"
                )
        })
    }

    if(title != ""){
        db.query("UPDATE user_info SET ? WHERE username =?", [{title:title}, usernameValidator], async(errP, lastNameUPdated) => {
            if(errP) throw errP
            // res.json({success:"Lastname Updated Successfully"})
            success.push(
                "Lastname updated"
                )
        })
    }

    if(gender != ""){
        db.query("UPDATE user_info SET ? WHERE username =?", [{gender:gender}, usernameValidator], async(errP, lastNameUPdated) => {
            if(errP) throw errP
            // res.json({success:"Lastname Updated Successfully"})
            success.push(
                "Lastname updated"
                )
        })
    }

    if(NewLocation != ""){
        db.query("UPDATE user_info SET ? WHERE username =?", [{home_address:NewLocation}, usernameValidator], async(errP, lastNameUPdated) => {
            if(errP) throw errP
            // res.json({success:"Lastname Updated Successfully"})
            success.push(
                "Lastname updated"
                )
        })
    }


    // // update Email only 
    // if(email){
    //     if (!validator.isEmail(email)) return res.json({ status: "error", error: "Please provide a valid email" });
    //     db.query("SELECT * FROM user_info WHERE email =?", [email], async (Err_exist, exist_email) => {

    //     if(Err_exist) throw Err_exist
    //     if(exist_email[0]){
    //         // EAST.push("3")
    //         db.query("SELECT email FROM user_info WHERE ID =?",[ID_Validator], async (chk, stop) => {
    //             if(chk) throw chk
    //            if(stop[0]){
    //             res.json({status:"error", error:"No change to the email"})
    //         }else{
    //             // WEST.push("4")
    //          res.json({status:"error", error:"Email already taken"})
    //         }
    //         })
    //     }else{
    //         if(40 == 20 + 20 && 30 == 20 + 10){
    //             db.query("UPDATE user_info SET ? WHERE ID =?", [{email:email}, ID_Validator], async(errP, EmailUpdated) => {
    //                 if(errP) throw errP
    //                 EmailUPdated.push(EmailUpdated)
    //                 res.json({success:"Email Updated Successfully"})
    //                 console.log("Email Updated")
    //             })
    //         }else{
    //             console.log("This is not working")
    //         }
    //     }
    //     })
    // }
     

     // update Username only 
     if(username !=""){
        db.query("SELECT * FROM user_info WHERE username =?", [username], async (Err_exist_username, exist_username) => {

        if(Err_exist_username) throw Err_exist_username
        if(exist_username[0]){
            db.query("SELECT username FROM user_info WHERE ID =?",[ID_Validator], async (chk_username, stop_username) => {
                if(chk_username) throw chk_username
               if(stop_username[0]){
                // res.json({status:"error", error:"Username has not changed"})
            }else{

                
            }
            })
        }else{
            if(40 == 20 + 20 && 30 == 20 + 10){
                db.query("UPDATE user_info SET ? WHERE ID =?", [{username:username}, ID_Validator], async(errP_username, usernameUpdated) => {
                    if(errP_username) throw errP_username
                    // res.json({success:"Username Updated Successfully"}
                    success.push(
                        "Username Updated"
                    )
                })
            }else{
                console.log("This is not working")
            }
        }
        })
    }

    const EmailUPdated = []
    const UsernameUpdated = []


    if(EmailUPdated.length > 0){
        // console.log(EmailUPdated)
    }
    if(success.length > 0){
    res.json({message:JSON.stringify(success)})

    }
            }
            
          })


        }
}

module.exports = updateAccount;
