const db = require("../routes/db.config");

const renderTutorialsPage = (req,res) =>{
    if(req.user){
        const username = req.user.usename
        const first_name = req.user.first_name
        const last_name = req.user.username
        const accountType = req.user.acct_type
    res.render("tutorials", {
        status: "logged",
        user: username,
        accountType: accountType,
        FirstName: first_name,
        LastName:last_name,

        logger:"logged",  user : req.user.username, ProfileImage:req.user.profile_picture, UserFirstname:req.user.first_name, UserLastName:req.user.last_name, Course:"Course", CourseYear:"CourseYear", accountType:req.user.acct_type, UserName:req.user.username, Email:req.user.email, username:req.user.username, Username:req.user.username, ASFI_CODE:req.user.unique_code
    })
}
}
module.exports = renderTutorialsPage 