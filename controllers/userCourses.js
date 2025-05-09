const db = require("../routes/db.config");

const userCourse = async  (req,res) =>{
    if(req.user.username){
        const username = req.user.username
    
    db.query("SELECT * FROM user_info WHERE username =?",[username], async (err, result)=>{
        if(err) throw err
        if(result[0]){
            const username = result[0].username
            const accountType = result[0].acct_type
            const FirstName = result[0].first_name
            const LastName = result[0].last_name
            const ProfileImage = result[0].profile_picture
            const Email = result[0].email

            const FollowersCountArray = []
            // GetFollowers 
           db.query("SELECT COUNT(*) AS main_followers FROM followers WHERE followingUsername =?", [username], async (err, followers) =>{
                    if(err) throw err
                    if(followers[0]){
                    const FollowersCount = followers[0]["main_followers"]
                    FollowersCountArray.push(FollowersCount)
                    }else{
                    const  FollowersCount = 0
                    FollowersCountArray.push(FollowersCount)
                    }
                        
                
                // }
            
               
            //Add queries number of people the user follows
            // Add queries for total courses the user is engaged with
            const FOLLOWING = []
            db.query("SELECT COUNT(*) AS followingCount FROM followers WHERE ?", [{followerUsername:username}], async (NIL, NULL) => {
                if(NIL) throw NIL
                var FollowingCount =JSON.stringify(NULL[0]["followingCount"]);
                FOLLOWING.push(FollowingCount)
            if(accountType == "scholar_account" || accountType == "user_account" || accountType == "administrator"){
            res.render("userCourses", {
        
                FirstName:FirstName,
                LastName:LastName,
                ProfileImage: ProfileImage,
                Email:Email,
                logger:"logged", user : req.user.username, ProfileImage:req.user.profile_picture, UserFirstname:req.user.first_name, UserLastName:req.user.last_name, Course:"Course", CourseYear:"CourseYear", accountType:req.user.acct_type, UserName:req.user.username, Email:req.user.email, username:req.user.username, Username:req.user.username, UserName:req.user.username,
                Followers:FollowersCountArray[0], 
                Following:FOLLOWING[0],
                user : req.user.username, ProfileImage:req.user.profile_picture, UserFirstname:req.user.first_name, UserLastName:req.user.last_name, Course:"Course", CourseYear:"CourseYear", accountType:req.user.acct_type, UserName:req.user.username, Email:req.user.email, username:req.user.username, Username:req.user.username, UserName:req.user.username, ASFI_CODE:req.user.unique_code
            })
         }else{
            res.redirect("/instructorCourses")
         }
        })
        })
        
        }
    })
    
}
} 


module.exports = userCourse