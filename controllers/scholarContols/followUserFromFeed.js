const db = require("../../routes/db.config");
const sendNewFollowerNotification = require("../notifications/newFollowerNotification");
const sendEmail = require("../utils/sendEmail");
const saveNotification = require("./saveNotification");



const FollowUserFromFeed = async (req, res) => {
  try{
    const { followed} = req.body;
    const decodedFollowed = decodeURIComponent(followed);
    const follower = req.user.username
    if(!req.cookies.userRegistered) return res.json({ status: "error", error: "Please Login to follow user"}); 
    // res.json({status:"loggedIn"})


    db.query("SELECT * FROM followers WHERE followerUsername = ? AND followingUsername = ?", [follower, decodedFollowed], async (ERR, followingScholar) => {

      followStats = "Follow"
      if(ERR) throw ERR
      if(followingScholar[0]) {
        followStats = "Following"
        return res.json({success:"Followed"})
      }
      else{ 
    db.query("INSERT INTO followers SET ? ", {followerUsername:follower, followingUsername:decodedFollowed}, async (error, followed_successfully) => {
        if(error) throw error
        db.query("SELECT * FROM user_info WHERE username = ? ", [decodedFollowed], async (err, scholar_user) => {
            if(err) throw err

           
          var firstName = scholar_user[0]['first_name'];
          var LastName = scholar_user[0]['last_name'];
          var profilePicture = scholar_user[0]['profile_picture'];
          const searchNameUser = scholar_user[0]['username'];
          var accountStatus = scholar_user[0]['account_status'];
          var title = scholar_user[0]['title'];
          var token = scholar_user[0].notification_token

          const displayName = firstName + "  " + LastName;

          const useremail = scholar_user[0].email
          const userID = scholar_user[0].id

          let userPhoto = ""
          if(req.user.profile_picture && req.user.profile_picture != "avatar.jpg" && req.user.profile_picture != null ){
            userPhoto = req.user.profile_picture
          }else{
            userPhoto = "https://res.cloudinary.com/dll8awuig/image/upload/v1705444097/dc69h8mggh01bvlvbowh.jpg"
          }

          const subject = "You have a new follower"
          const message = `
          <style>
body{
box-sizing: border-box;
padding: 0;
margin:0;
}

</style>
<div class="card"
width: 400px;
align-items: center;
background:white;
border-bottom-right-radius: 25px;
border-bottom-left-radius: 25px;
border:1px solid purple;
padding:0px 0px 20px 0px;">
<p><div class="logo_container" style="    display:flex;
align-items:center;
justify-content: center;
width:150px;
padding:0px 50px;
background-color: white;
border-bottom-right-radius: 25px;
border-bottom-left-radius: 25px;">
<img src="https://asfischolar.org/files/images/ASFIScholar_Logo.png" alt="logo" style="width:100%;
height:100%;
border-radius: inherit;
object-fit: cover;">
</div>
</p>
<br>
<p><div class="profileImg" style="
width:100px;
height:100px;
border-radius: 50%;
overflow: hidden;">
<img src="${userPhoto}" alt="profile_img" style="width:100%;
height:100%;
border-radius: inherit;
object-fit: cover;">
</div>
</p>
<br>
<p><div class="text-container" style="   

align-items: center;
justify-content: center;">
<p><div class="name" style="font-weight: bold;">${req.user.first_name} ${req.user.last_name}</div></p>

<p><div>Just Followed you</div></p>
</div>
</p>
<br>
<p><a href="https://asfischolar.org/@${req.user.username}">
<button style="    display: flex;
padding:10px;
background:purple;
border:none;
outline:none;
color:white;
border-radius: 25px;">View Profile</button>
</p>
</a>
</div>
`;

const followerFullname = `${req.user.first_name} ${req.user.last_name}`
          
const Endpoint = `/@${userID}`
await saveNotification(req.user.username, userID, `${followerFullname} started following you`, userPhoto, Endpoint,"no")


          const sendEmailNotification = await sendEmail(useremail, subject, message)

      
          await sendNewFollowerNotification(followerFullname, token)

      
          var summation_FX = 5
            const following = "Following";
              // this part of the code send the user data to our profile.ejs page 
              // res.render("profile", { searchName: displayName, personTitle: title, personProfilePicture: profilePicture, accountStatus:accountStatus, visitor:follower, searchUSERNAME:searchNameUser, summation_FX :summation_FX, followStatus: following, TutorialsArray:"[]", tutorialSum:0,  SocialLinks:"[]" })
              return res.json({success:"Followed"})

          
            
          //  } 
        })
        
    })}
  })
  }catch(error){
    console.log(error)
  }
 }


 module.exports = FollowUserFromFeed