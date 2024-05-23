const db = require("../routes/db.config");

const becomeScholarPage = (req,res) =>{
    if(req.user){
        const username = req.user.username

        db.query("SELECT * FROM user_info WHERE username =?", [username], async(err,data)=>{
            if(err) throw err
            if(data[0]){
                const AccountType  = data[0].acct_type
                const FirstName = data[0].first_name
                const LastName = data[0].last_name
                const ProfileImage = data[0].profile_picture
                const Email = data[0].email

                if(AccountType == "user_account"){
                    res.render("becomeScholar", {
                        UserName: username,
                        accountType:AccountType,
                        FirstName:FirstName,
                        LastName: LastName,
                        ProfileImage:ProfileImage,
                        Email:Email
                    })
                }
                else{
                    res.redirect("/settings")
                }
            }
        })
    }
}

module.exports =  becomeScholarPage