const db = require("../../routes/db.config");

const CreateCoursePage = (req,res) =>{
    if(req.user){
        const userName = req.user.username
        db.query("SELECT * FROM user_info WHERE username =?", userName,(err, data)=>{
            if(err) throw err
            if(data[0]){
                const Firstname = data[0].first_name
                const Lastname = data[0].last_name
                const ProfileImage = data[0].profile_picture
                const email = data[0].email
                const accountType = data[0].acct_type

                if(accountType != "instructor_account"){
                    res.render("error", {status:"Unathorized Access"})
                }else{
                res.render("instructorCreateCourse", {
                    UserName: userName, accountType:accountType, FirstName:Firstname, LastName: Lastname, ProfileImage: ProfileImage, Email:email
                })
                }
            }
        })
 
}
}

module.exports = CreateCoursePage