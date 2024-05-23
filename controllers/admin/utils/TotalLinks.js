const db = require("../../../routes/db.config");

const TotalLinks = async (req,res) =>{
    const username = req.params.username

    db.query("SELECT COUNT(*) AS Links_count FROM external_links WHERE link_owner =?", [username], async (err,data)=>{
        if(err) throw err
        res.json({TotalLinks:new Number(data[0]["Links_count"])})
    })
}


module.exports = TotalLinks