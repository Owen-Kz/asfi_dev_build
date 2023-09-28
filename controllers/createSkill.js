const db = require("../routes/db.config");

const createSkill = (req,res) =>{
    if(req.user){
        const username = req.user.username
        // res.json({message:req.body})
        const {skill_name} = req.body
        if(skill_name){
        db.query("SELECT * FROM technical_expertise WHERE skill_name =? AND skill_owner_username =?",[skill_name, username], async (err,data)=>{
            if(err) throw err
            if(data[0]){
                res.json({message:"Data Already Exists"})
            }else{
                db.query("INSERT INTO technical_expertise SET ?", [{skill_name:skill_name, skill_owner_username:username}], async(err,insert) =>{
                    if(err) throw err
                    if(insert){
                    res.json({message: "Skill had been added Successfully"})
                    }else{
                        res.json({message:"Internal Server Error"})
                    }
                })
            }
        })
    }
    }
}

module.exports = createSkill