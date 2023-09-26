const db = require("../routes/db.config");

const Assets = async (req,res) =>{
    if(req.user.username){
        const  username = req.user.username

        db.query("SELECT * FROM user_info WHERE username =?", [username], async (Err, data) =>{
            if(Err) throw Err
            if(data[0]){
                var followersCount
                var  followingCount
                const accountType = data[0].acct_type
                const Firstname = data[0].first_name
                const Lastname = data[0].last_name
                const ProfilePicture = data[0].profile_picture
                const Email = data[0].email

                db.query("SELECT COUNT (*) AS followersCount FROM followers WHERE followingusername =?", [username], async(err, followers) =>{
                    if(err) throw err
                    if(followers[0]["followersCount"]){
                        followersCount = followers[0]["followersCount"]
                    }else{
                        followersCount = 0
                    }
                db.query("SELECT COUNT(*) AS followingCount FROM followers WHERE followerUsername =?", [username], async (err, following) =>{
                    if(err) throw err
                    if(following[0]["followingCount"]){
                        followingCount = following[0]["followingCount"]
                    }else{
                        followingCount = 0
                    }

                    
                    if(accountType == "scholar_account" || accountType == "instructor_account"){
                    res.render("assets", {
                        UserName: username, Username:username, accountType:accountType, UserFirstname:Firstname, FirstName:Firstname,UserLastName:Lastname, LastName:Lastname, ProfileImage: ProfilePicture, Email:Email, Followers:followersCount, Following:followingCount
                    })

                }else{
                    res.redirect("/courses")
                }
                })

                })
            }
        })
    
    }
}

module.exports = Assets