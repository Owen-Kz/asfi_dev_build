const feedsPage = async (req,res) =>{
    try{
        if(req.user){
            let userProfileImage = "" 
            if(req.user.profile_picture == "avatar.jpg"){ 
					userProfileImage = `https://eu.ui-avatars.com/api/?background=random&name=${req.user.first_name}+${req.user.last_name}&font-size=0.5&rounded=true&size=128&background=333333&color=ffffff`
            }else{
                userProfileImage = req.user.profile_picture
            }
        res.render("feed", {status :"logged", logger:"logged", user : req.user.username, ProfileImage:userProfileImage, UserFirstname:req.user.first_name, UserLastName:req.user.last_name, Course:"Course", CourseYear:"CourseYear", accountType:req.user.acct_type, UserName:req.user.username, Email:req.user.email, username:req.user.username, Username:req.user.username, UserName:req.user.username})
        }else{
            res.render("login")
        }
    }catch(error){
        console.log(error)
        res.json({error:error.message})
    }
}


module.exports = feedsPage