const db = require("../routes/db.config");
const bcrypt = require("bcryptjs");

const CreateNewPassword = async (req,res) =>{
    try{
    const {password} = req.body

    const EmailData = JSON.parse(req.cookies.emailData)
    const emailAccount = EmailData.email 
    
    const userEmail = emailAccount


    db.query("SELECT * FROM user_info WHERE email =? ", [userEmail], async (err,data) =>{
        if(err) throw err
        if(data[0]){
    const passwordN = await bcrypt.hash(password, 8)
       
            db.query("UPDATE user_info SET ? WHERE email =?", [{password:passwordN}, userEmail], async(Err,resetSuccess)=>{
                if(Err) throw Err
                res.json({message:"PasswordReset"})
            }) 
        }else{
            res.json({message:"Data does not exist"})
        }
    })
}catch(error){
    console.log(error)
    res.json({message:error.message})
}
}
module.exports = CreateNewPassword