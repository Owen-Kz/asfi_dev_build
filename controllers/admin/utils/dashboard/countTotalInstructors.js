const db = require("../../../../routes/db.config");

const TotalINstructors = (req,res) =>{
    db.query("SELECT COUNT(*) AS TotalCount FROM user_info WHERE acct_type = 'instructor_account'", async (err,data)=>{
        if(err) throw err
        res.json({TotalCount:data[0]["TotalCount"]})
    })
}

module.exports = TotalINstructors