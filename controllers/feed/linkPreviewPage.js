const linkPreviewPage = async (req,res) =>{
const dummyUser = {
    username: "Sign in",
    first_name: "",
    last_name: "", 
    profile_picture: "https://res.cloudinary.com/dll8awuig/image/upload/v1705444097/dc69h8mggh01bvlvbowh.jpg",
    email: "",
    acct_type: "scholar_account"
    }

    const userData = req.user ? req.user : dummyUser
if(userData){
   const link = req.query.x 
if(link){
    res.render("linkPreview", { link, logger:"logged", user : userData.username, ProfileImage:userData.profile_picture, UserFirstname:userData.first_name, UserLastName:userData.last_name, Course:"Course", CourseYear:"CourseYear", accountType:userData.acct_type, UserName:userData.username, Email:userData.email, username:userData.username, Username:userData.username, UserName:userData.username });
}else{
    res.redirect("/home")
}
}else{
    res.render("loginExternal")
}

}


module.exports = linkPreviewPage