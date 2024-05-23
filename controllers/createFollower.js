const db = require("../routes/db.config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const profile = require("./profile")

const newFollower = async (req, res) => {
    const { followed, follower } = req.body;

    if(!req.cookies.userRegistered) return res.json({ status: "error", error: "Please Login to follow user"}); 
    res.json({status:"loggedIn"})


    db.query("SELECT * FROM followers WHERE followerUsername = ? AND followingUsername = ?", [follower, followed], async (ERR, followingScholar) => {

      followStats = "Follow"
      if(ERR) throw ERR
      if(followingScholar[0]) followStats = "Following"
      else{ 
    db.query("INSERT INTO followers SET ? ", {followerUsername:follower, followingUsername:followed}, async (error, followed_successfully) => {
        if(error) throw error
        db.query("SELECT * FROM user_info WHERE username = ? ", [followed], async (err, scholar_user) => {
            if(err) throw err
  
          var firstName = scholar_user[0]['first_name'];
          var LastName = scholar_user[0]['last_name'];
          var profilePicture = scholar_user[0]['profile_picture'];
          const searchNameUser = scholar_user[0]['username'];
          var accountStatus = scholar_user[0]['account_status'];
          var title = scholar_user[0]['title'];

          const displayName = firstName + "  " + LastName;

        
          var summation_FX = 5
            const following = "Following";
              // this part of the code send the user data to our profile.ejs page 
              // res.render("profile", { searchName: displayName, personTitle: title, personProfilePicture: profilePicture, accountStatus:accountStatus, visitor:follower, searchUSERNAME:searchNameUser, summation_FX :summation_FX, followStatus: following, TutorialsArray:"[]", tutorialSum:0,  SocialLinks:"[]" })


              // res.redirect(`/@${followed}`)
              console.log("success")
            
          //  } 
        })
        
    })}
  })

 }


 module.exports = newFollower