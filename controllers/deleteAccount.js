const db = require("../routes/db.config");

const deleteAccountPage = async  (req,res) =>{
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
            const BufferId = result[0].buffer
            const Email = result[0].email
            const coverPhoto = result[0].cover_photo
         
            res.render("deleteAccount", {
                UserName: username,
                Username:username,
                accountType:accountType,
                FirstName:FirstName,
                LastName:LastName,
                ProfileImage: ProfileImage,
                Email:Email,
                Following:0,
                BufferId: BufferId,
                CoverPhoto:coverPhoto,
                logger:"logged", user : req.user.username, ProfileImage:req.user.profile_picture, UserFirstname:req.user.first_name, UserLastName:req.user.last_name, Course:"Course", CourseYear:"CourseYear", accountType:req.user.acct_type, UserName:req.user.username, Email:req.user.email, username:req.user.username, Username:req.user.username, UserName:req.user.username, ASFI_CODE:req.user.unique_code,

            })
    
        }
    })
    
}
} 


module.exports = deleteAccountPage