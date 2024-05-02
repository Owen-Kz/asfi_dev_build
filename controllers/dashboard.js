const db = require("../routes/db.config");

const dashboard = async(req, res) => {
    console.log(req)
    if(req.user){
        username_new = req.user.username
        if(username_new){
        // console.log(username_new)
        db.query("SELECT * FROM user_info WHERE username =?", [username_new], (err,result) => {
            if(err) throw err
            UserFirstname = result[0]["first_name"]
            UserLastname = result[0]["last_name"]
            ProfileImage = result[0]["profile_picture"]
            Course = result[0]["course_assigned"]
            accountType = result[0]["acct_type"]
            Email = result[0]["email"]
          
            CourseYear = result[0]["school_year"] 
        if(accountType == "user_account"){
        res.render("dashboard.ejs", {root:"./public", status :"logged", logger:"logged", user : username_new, ProfileImage:ProfileImage, UserFirstname:UserFirstname, UserLastName:UserLastname, Course:Course, CourseYear:CourseYear, accountType:accountType, UserName:username_new, Email:Email, username:username_new, Username:username_new, UserName:username_new})
        }else if(accountType == "instructor_account"){
            res.render("instructorDashboard.ejs", {status :"logged", logger:"logged", user : username_new, ProfileImage:ProfileImage, UserFirstname:UserFirstname, UserLastName:UserLastname, Course:Course, CourseYear:CourseYear, accountType:accountType, UserName:username_new, Email:Email, username:username_new, Username:username_new, UserName:username_new})
        }else if(accountType == "scholar_account"){
            res.render("scholarDashboard.ejs", { status :"logged", logger:"logged", user : username_new, ProfileImage:ProfileImage, UserFirstname:UserFirstname, UserLastName:UserLastname, Course:Course, CourseYear:CourseYear, accountType:accountType, UserName:username_new, Email:Email, username:username_new, Username:username_new, UserName:username_new})
        }
    })
        }
       }
       else{
        console.log("ERROR :  user not logged in")
        // res.render("index", {status :"no", user:"NotLoggedIn"})
       }
}

module.exports = dashboard