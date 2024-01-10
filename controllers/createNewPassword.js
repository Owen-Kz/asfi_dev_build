const db = require("../routes/db.config");
const bcrypt = require("bcryptjs");

const CreateNewPassword = async (req,res) =>{
    const {password} = req.body
    const userEmail = req.session.tokenData.confirmEmail


    db.query("SELECT * FROM user_info WHERE email =? ", [userEmail], async (err,data) =>{
        if(err) throw err
        if(data[0]){
    const passwordN = await bcrypt.hash(password, 8)
            console.log(passwordN)
            console.log( await bcrypt.hash("1234NSA", 8))
            console.log(await bcrypt.hash(password, 8))
            console.log(password)
            db.query("UPDATE user_info SET ? WHERE email =?", [{password:passwordN}, userEmail], async(Err,resetSuccess)=>{
                if(Err) throw Err
                res.json({message:"PasswordReset"})
            }) 
        }else{
            res.json({message:"Data does not exist"})
        }
    })
}
module.exports = CreateNewPassword