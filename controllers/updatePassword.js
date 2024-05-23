const db = require("../routes/db.config");
const bcrypt  = require("bcryptjs")


const updatePassword = async (req,res) =>{
   const {currentPassword, NewPassword, username} = req.body
   if(NewPassword){

    db.query("SELECT * FROM user_info WHERE username =?", [username], async (err,data)=>{
        if(err) throw err
     
        if(data[0] && await bcrypt.compare(currentPassword, data[0].password)){
            console.log(currentPassword)
            console.log(data[0].password)
            
            const NewPass = await bcrypt.hash(NewPassword,8)
            db.query("UPDATE user_info SET ? WHERE ?", [{password:NewPass}, {username:username}], (err, password)=>{
                if(err) throw err
                if(password){
                    res.json({message:"Password Updated Succesfully"})
                }else{
                    res.json({message:"internal Server Error: Password Has not changed"})
                }
                
            })
        }else{
            res.json({message:"incorrect Current Password"})
        }

    })
   }
}

module.exports = updatePassword