const db = require("../routes/db.config");

const totalFollowersCount = (req,res) =>{
if(req.user){
    const UserName = req.user.username
    db.query(
        "SELECT COUNT(*) AS followingCount FROM followers WHERE ?",
        [{ followingUsername: UserName }],
        async (err, rows) => {
          if (err) throw err;
          var FollowersCountMain = JSON.stringify(rows[0]["followingCount"]);
          res.json({totalFollowersCount: FollowersCountMain})

        })
}
}

module.exports = totalFollowersCount