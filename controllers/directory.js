const db = require("../routes/db.config");

const Directory = (req, res) => {
  if (req.user) {
    const username_new = req.user.username
    db.query("SELECT * FROM user_info WHERE username =?",[username_new], (err, result)=>{
if(err) throw err
  if(result[0]){
    const accountType = result[0].acct_type
            res.render("directory.ejs", {
              status: "logged",
              dataJSON: "[]",
              dataUnfollowed: "[]", // Pass the JSON string to the template
              user: username_new,
              accountType:accountType,
                    logger:"logged", user : username_new, ProfileImage:req.user.profile_picture, UserFirstname:req.user.first_name, UserLastName:req.user.last_name, Course:"Course", CourseYear:"CourseYear", accountType:req.user.acct_type, UserName:username_new, Email:req.user.email, username:username_new, Username:username_new, UserName:username_new
            });
          }
   })  
}
}

module.exports = Directory;
