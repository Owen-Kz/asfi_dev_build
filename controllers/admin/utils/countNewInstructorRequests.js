const db = require("../../../routes/db.config");

const CountNewInstructorRequests = async (req,res) =>{
    db.query("SELECT * FROM user_info WHERE 1", async (err, userData)=>{
        if(err) throw err
        if(userData[0]){
            db.query("SELECT COUNT(*) AS InstrucorRequestCount FROM user_info WHERE account_status = '2'", async (err, data)=>{
                if(err) throw err
              
                res.json({requestCount:data[0]["InstrucorRequestCount"]})
            })
        }
    })
 
}

module.exports = CountNewInstructorRequests