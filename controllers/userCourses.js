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
            if(accountType == "scholar_account" || accountType == "user_account"){
            res.render("userCourses", {
                UserName: username,
                accountType:accountType,
                FirstName:FirstName,
                LastName:LastName,
                ProfileImage: ProfileImage,
                Email:Email,
                Followers:FollowersCountArray[0], 
                Following:FOLLOWING[0],
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