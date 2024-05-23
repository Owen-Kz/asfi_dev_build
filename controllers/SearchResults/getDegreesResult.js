const db = require("../../routes/db.config");

const getDegree = (req,res) =>{
    const username = req.params.username
    if(username){
        db.query("SELECt * FROM honoraries WHERE scholar_username =?", [username], async (err, honorData) =>{
            if(err) throw err
            if(honorData[0]){
                res.json({AllDegrees:JSON.stringify(honorData)})
            }else{
                res.json({AllDegrees: "[]"})
            }
        })
    }
}

module.exports = getDegree