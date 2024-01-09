const db = require("../../../../routes/db.config");

const ApproveInstructorAccount = async(req,res)=>{

    const {username} = req.body
    db.query("SELECT * FROM user_info WHERE username =?", [username], async (err,data) =>{
        if(err) throw err
        if(data[0]){
            db.query("UPDATE user_info SET account_status = '3' WHERE username =?",[username], async (err, approved)=>{
                if(err) throw err
                res.json({status:"success", message:"Approved! An email will be sent to the user shortly"})
            })
        }else{
            res.son({status:"error", message:"User not found"})
        }
    })
}

module.exports = ApproveInstructorAccount