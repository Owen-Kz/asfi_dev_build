const db = require("../routes/db.config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const profile = require("./profile")

// const LoggedIn = require("./loggedin");

const removeFollower = async (req, res) => {
    const { UNfollowed, UNfollower } = req.body;

    if(!req.cookies.userRegistered) return res.json({ status: "error", error: "Please Login to follow user"}); 
    res.json({status:"loggedIn"})


    db.query("SELECT * FROM followers WHERE followerUsername = ? AND followingUsername = ?", [UNfollower, UNfollowed], async (ERR, followingScholar) => {

      followStats = "Follow"
      if(ERR) throw ERR
      if(followingScholar[0]) followStats = "Following"
    db.query("DELETE FROM followers WHERE followerUsername = ? AND followingUsername = ?", [UNfollower, UNfollowed], async (error, UNfollowed_successfully) => {
        if(error) throw error
        db.query("SELECT * FROM user_info WHERE username = ?", [UNfollowed], async (err, scholar_user) => {
            if(err) throw err

          var firstName = scholar_user[0]['first_name'];
          var LastName = scholar_user[0]['last_name'];
          var profilePicture = scholar_user[0]['profile_picture'];
          const searchNameUser = scholar_user[0]['username'];
          var accountStatus = scholar_user[0]['account_status'];
          var title = scholar_user[0]['title'];

          const displayName = firstName + "  " + LastName;

        
          var summation_FX = 5
            const follow = "Follow";
              // this part of the code send the user data to our profile.ejs page 
              res.render("profile", {root: "./public/directory/profile", searchName: displayName, personTitle: title, personProfilePicture: profilePicture, accountStatus:accountStatus, visitor:UNfollower, searchUSERNAME:searchNameUser, summation_FX :summation_FX, followStatus: follow})
              console.log("success")
           
          //  }
        })
        
    })
  })

 }


 module.exports = removeFollower