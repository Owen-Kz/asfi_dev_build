const dbPromise = require("../../routes/dbPromise.config")

const feedsPage = async (req,res) =>{
    try{
        if(req.user){
            let userProfileImage = "" 
            if(req.user.profile_picture == "avatar.jpg"){ 
					userProfileImage = `https://eu.ui-avatars.com/api/?background=random&name=${req.user.first_name}+${req.user.last_name}&font-size=0.5&rounded=true&size=128&background=333333&color=ffffff`
            }else{
                userProfileImage = req.user.profile_picture
            }
            const getAnnoucement = await dbPromise.query("SELECT * FROM announcements ORDER BY id DESC LIMIT 1")
            let announcementTitle = ""
            let content = "[]"
            let announcementDate = ""
            if(getAnnoucement[0].length > 0){
             announcementTitle = getAnnoucement[0][0].title 
            content = getAnnoucement[0][0].data
            announcementDate = getAnnoucement[0][0].timestamp
            }

        res.render("feed", {status :"logged", logger:"logged", user : req.user.username, ProfileImage:userProfileImage, UserFirstname:req.user.first_name, UserLastName:req.user.last_name, Course:"Course", CourseYear:"CourseYear", accountType:req.user.acct_type, UserName:req.user.username, Email:req.user.email, username:req.user.username, Username:req.user.username, UserName:req.user.username, announcementTitle, content, announcementDate, ASFI_CODE:req.user.unique_code, success:true})
        }else{
            res.render("loginExternal")
        }
    }catch(error){
        console.log(error)
        res.json({error:error.message})
    }
}


module.exports = feedsPage