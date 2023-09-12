const db = require("../../routes/db.config");

const instructorCourses  = async  (req,res) =>{
    if(req.user){
        const Username  = req.user.username
        db.query("SELECT * FROM user_info WHERE username =?", [Username], async(err, data)=>{

            if(err) throw err
            const accountType = data[0].acct_type
            const First_name = data[0].first_name
            const Last_name = data[0].last_name
            const profilePicture = data[0].profile_picture
            const email =  data[0].email
      
                if(err) throw err
                res.render("instructorCourses", {
                    UserName: Username,
                    Username: Username,
                    accountType:accountType,
                    UserFirstname:First_name,
                    FirstName:First_name,
                    UserLastName: Last_name,
                    LastName: Last_name,
                    ProfileImage:profilePicture,
                    Email:email
                })
        
        })
    
}
}

module.exports = instructorCourses