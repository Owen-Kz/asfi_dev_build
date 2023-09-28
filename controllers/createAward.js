const db = require("../routes/db.config");

const createAward = (req,res) =>{
    if(req.user){
        const username = req.user.username
        // res.json({message:req.body})
        const {award_title, awarded_by} = req.body
        if(award_title){
        db.query("SELECT * FROM awards_honors WHERE award_title =? AND awarded_by =? AND award_owner_username =?",[award_title, awarded_by, username], async (err,data)=>{
            if(err) throw err
            if(data[0]){
                res.json({message:"Data Already Exists"})
            }else{
                db.query("INSERT INTO awards_honors SET ?", [{award_title:award_title, awarded_by: awarded_by, award_owner_username:username}], async(err,insert) =>{
                    if(err) throw err
                    if(insert){
                    res.json({message: "Award had been added Successfully"})
                    }else{
                        res.json({message:"Internal Server Error"})
                    }
                })
            }
        })
    }
    }
}

module.exports = createAward