const db = require("../../routes/db.config");

const totalfollowers = (req,res) =>{
    const Username = req.params.username
    db.query("SELECT COUNT(*) as TotalfollowersCount FROM followers WHERE followingUsername =?",[Username], async(err, data)=>{
        if(err) throw err
        if(data){
            const total_followersCount = data[0]["TotalfollowersCount"]
              res.json({message:`Totalfollowers`, TotalFollowers: total_followersCount})
        }
    })
}

module.exports = totalfollowers