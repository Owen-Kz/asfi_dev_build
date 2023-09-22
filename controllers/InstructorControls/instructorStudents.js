const db = require("../../routes/db.config");

const instructorStudents = (req,res) =>{
    if(req.user){
        const username = req.user.username
        const FirstName = req.user.first_name
        const LastName = req.user.last_name
        const proffilePicture  = req.user.profile_picture
        const account_type = req.user.acct_type
        const Email = req.user.email

        
        res.render("instructorStudents", {
            UserName: username, accountType:account_type, FirstName:FirstName, LastName: LastName, ProfileImage: proffilePicture, Email:Email, UserFirstname:FirstName, UserLastName: LastName, Username:username
        })
    }
   
}

module.exports = instructorStudents