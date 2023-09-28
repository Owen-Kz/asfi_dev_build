

const db = require("../../routes/db.config");

const ExpertiseResult = (req,res) =>{
    if(req.user){
        const searchUsername = req.params.username
        db.query("SELECT * FROM technical_expertise WHERE skill_owner_username =?", [searchUsername], async(err, data)=>{
            if(err) throw err
            if(data[0]){
                res.json({SkillArray:JSON.stringify(data)})
            }else{
                res.json({SkillArray:"[]"})
            }
        })
    }
}

module.exports = ExpertiseResult