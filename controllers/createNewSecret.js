const db = require("../routes/db.config");
const bcrypt = require("bcryptjs");

const createNewPassword = async( req,res) => {
    const {NewPassword, userEmail}  = req.body

    if(!NewPassword, userEmail) return res.JSON({status:"Invalid Request"})
    else{
        const password = await bcrypt.hash(Newpassword, 8)
     db.query("UPDATE user_info SET password = ? WHERE email ?", [password, userEmail], async (err, pass) =>{
        if(err) throw err 
        res.render("successful", {message: "Password Reset Succesfully", page:"/login"})
     })
    }
}

module.exports = createNewPassword;