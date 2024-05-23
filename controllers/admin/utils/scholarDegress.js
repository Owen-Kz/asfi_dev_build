const db = require("../../../routes/db.config");

const ScholarDegrees = async (req,res) =>{
    const username = req.params.username

    db.query("SELECT * FROM honoraries WHERE scholar_username =?", [username], async(err, data)=>{
        if(err) throw err
        res.json({Degrees:JSON.stringify(data)})
    })
}

module.exports = ScholarDegrees