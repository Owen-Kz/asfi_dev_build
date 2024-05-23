

const db = require("../../routes/db.config");

const AwardResult = (req,res) =>{
    if(req.user){
        const searchUsername = req.params.username
        db.query("SELECT * FROM awards_honors WHERE award_owner_username =?", [searchUsername], async(err, data)=>{
            if(err) throw err
            if(data[0]){
                res.json({AwardArray:JSON.stringify(data)})
            }else{
                res.json({AwardArray:"[]"})
            }
        })
    }
}

module.exports = AwardResult