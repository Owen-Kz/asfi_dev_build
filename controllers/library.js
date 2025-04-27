const db = require("../routes/db.config");
const fetchWebsiteData = require("./utils/getLinkPreview");


const library = async (req, res) => {

if(req.user){
  const username_new = req.user.username;


    res.render("library.ejs", {
      status: "logged",
      logger:"logged", user : username_new, ProfileImage:req.user.profile_picture, UserFirstname:req.user.first_name, UserLastName:req.user.last_name, Course:"Course", CourseYear:"CourseYear", accountType:req.user.acct_type, UserName:username_new, Email:req.user.email, username:username_new, Username:username_new, UserName:username_new, ASFI_CODE:req.user.unique_code
 
    });


}
};

module.exports = library;
