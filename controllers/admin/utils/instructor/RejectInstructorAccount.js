const db = require("../../../../routes/db.config");


const RejectInstructorAccount = async(req,res)=>{
    const {username} = req.body
    db.query("SELECT * FROM user_info WHERE username =?", [username], async (err,data) =>{
        if(err) throw err
        if(data[0]){
            db.query("UPDATE user_info SET account_status = '0' WHERE username =?",[username], async (err, Rejectd)=>{
                if(err) throw err
                res.json({status:"success", message:"Rejected!! An email will be sent to the user shortly"})
            })
        }else{
            res.son({status:"error", message:"User not found"})
        }
    })
}

module.exports = RejectInstructorAccount