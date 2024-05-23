const db = require("../routes/db.config");

const tutorialsByAuthor = async (req, res)=>{
    const Owner = req.params.tutorialOwner
    db.query("SELECT * FROM tutorials WHERE tutorial_owner =? ORDER BY id DESC LIMIT 10", [Owner], (err, dataRes)=>{
        if(err) throw err
        if(dataRes){
            res.json({TutorialsByAuthorData:JSON.stringify(dataRes)})
        }
    })
}

module.exports = tutorialsByAuthor