const db = require("../routes/db.config");

const confrim_code = async (req,res) =>{
    const {confirmCode, confirmEmail} = req.body
    console.log(req.body)

    if(!confirmCode || !confirmEmail){
        return res.json({Status: "Err", Error: "You Did not provide Valid credentials"})
    }else{
        db.query("SELECT * FROM user_info WHERE ?", [{email:confirmEmail, resetToken:confirmCode}], async (err, cnf) => {
            if (err) throw err
            if(cnf){
           req.session.tokenData = { confirmCode:confirmCode,  confirmEmail: confirmEmail};
                
                // res.render("newPassword", {message:"Enter New Password", email:confirmEmail})
                res.status(200).json({success:"Code is confirmed"})
            }
        })
    } 
}


module.exports = confrim_code