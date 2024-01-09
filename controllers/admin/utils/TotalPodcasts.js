const db = require("../../../routes/db.config");


const TotalPodcasts = async (req,res) =>{
    const username = req.params.username

    db.query("SELECT COUNT(*) AS Podcasts_count FROM podcasts WHERE podcast_owner =?", [username], async (err,data)=>{
        if(err) throw err
        res.json({TotalPodcasts:new Number(data[0]["Podcasts_count"])})
    })
}


module.exports = TotalPodcasts