const db = require("../../routes/db.config");

const totalFollowing = (req,res) =>{
    const Username = req.params.username
    db.query("SELECT COUNT(*) as TotalFollowingCount FROM followers WHERE followerUsername =?",[Username], async(err, data)=>{
        if(err) throw err
        if(data){
            const total_FollowingCount = data[0]["TotalFollowingCount"]
              res.json({message:`TotalFollowing`, TotalFollowers: total_FollowingCount})
        }
    })
}

module.exports = totalFollowing