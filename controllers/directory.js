const db = require("../routes/db.config");
const readAnnouncmentCheck = require("./utils/readAnnouncmentCheck");

const Directory = (req, res) => {
  if (req.user) {
    const username_new = req.user.username;

    // First, get the latest announcement
    db.query("SELECT * FROM announcements WHERE priority = 1", async (err, annResult) => {
      if (err) throw err;

      let announcementTitle = "";
      let content = "[]";
      let announcementDate = "";
      let announcementId = ""
      let isRead = false

      if (annResult.length > 0) {
        announcementTitle = annResult[0].title;
        content = annResult[0].data;
        announcementDate = annResult[0].timestamp;
        announcementId = annResult[0].id
       
        isRead = await readAnnouncmentCheck(req.user.id, announcementId)

      }

      // Then, get the user info
      db.query("SELECT * FROM user_info WHERE username = ?", [username_new], (err, result) => {
        if (err) throw err;

        if (result[0]) {
          const accountType = result[0].acct_type;

          res.render("directory.ejs", {
            status: "logged",
            dataJSON: "[]",
            dataUnfollowed: "[]",
            user: username_new,
            accountType: accountType,
            logger: "logged",
            ProfileImage: req.user.profile_picture,
            UserFirstname: req.user.first_name,
            UserLastName: req.user.last_name,
            Course: "Course",
            CourseYear: "CourseYear",
            UserName: username_new,
            Email: req.user.email,
            username: username_new,
            Username: username_new,
            announcementTitle,
            isRead,
            content,
            announcementDate,
            ASFI_CODE:req.user.unique_code,
            success: true
          });
        }
      });
    });
  }
};

module.exports = Directory;
