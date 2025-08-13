const db = require("../routes/db.config");
const dbPromise = require("../routes/dbPromise.config");
const readAnnouncmentCheck = require("./utils/readAnnouncmentCheck");

const dashboard = async(req, res) => {
    if(req.user){
        username_new = req.user.username
        if(username_new){
        // console.log(username_new)
        db.query("SELECT * FROM user_info WHERE username =?", [username_new], async (err,result) => {
            if(err) throw err
            UserFirstname = result[0]["first_name"]
            UserLastname = result[0]["last_name"]
            ProfileImage = result[0]["profile_picture"]
            Course = result[0]["course_assigned"]
            accountType = result[0]["acct_type"]
            Email = result[0]["email"]
            ASFI_ID = result[0].unique_code 
          
            CourseYear = result[0]["school_year"] 
            const getAnnoucement = await dbPromise.query("SELECT * FROM announcements WHERE priority = 1")
            let announcementTitle = ""
            let content = "[]"
            let announcementDate = ""
            let announcementId = ""
            let isRead = false
            if(getAnnoucement[0].length > 0){
             announcementTitle = getAnnoucement[0][0].title 
            content = getAnnoucement[0][0].data
            announcementDate = getAnnoucement[0][0].timestamp
            announcementId = getAnnoucement[0][0].id
            isRead = await readAnnouncmentCheck(req.user.id, announcementId)
            }
        if(accountType == "user_account"){
        res.render("dashboard.ejs", {root:"./public", status :"logged", logger:"logged", user : username_new, ProfileImage:ProfileImage, UserFirstname:UserFirstname, UserLastName:UserLastname, Course:Course, CourseYear:CourseYear, accountType:accountType, UserName:username_new, Email:Email, username:username_new, Username:username_new, UserName:username_new, announcementTitle, isRead, announcementId, content, announcementDate, ASFI_CODE:ASFI_ID, success:true})
        }else if(accountType == "instructor_account"){
            res.render("instructorDashboard.ejs", {status :"logged", logger:"logged", user : username_new, ProfileImage:ProfileImage, UserFirstname:UserFirstname, UserLastName:UserLastname, Course:Course, CourseYear:CourseYear, accountType:accountType, UserName:username_new, Email:Email, username:username_new, Username:username_new, UserName:username_new, announcementTitle, isRead, announcementId, content, announcementDate, ASFI_CODE:ASFI_ID, success:true})
        }else if(accountType == "scholar_account" || accountType == "administrator"){
            res.render("scholarDashboard.ejs", { status :"logged", logger:"logged", user : username_new, ProfileImage:ProfileImage, UserFirstname:UserFirstname, UserLastName:UserLastname, Course:Course, CourseYear:CourseYear, accountType:accountType, UserName:username_new, Email:Email, username:username_new, Username:username_new, UserName:username_new, announcementTitle, isRead, announcementId, content, announcementDate, ASFI_CODE:ASFI_ID, success:true})
        }
    })
        }
       }
       else{
        console.log("ERROR :  user not logged in")
        res.json({status:"error", message:"userNotLoggedIn"})
        // res.render("index", {status :"no", user:"NotLoggedIn"})
       }
}

module.exports = dashboard