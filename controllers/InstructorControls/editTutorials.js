const db = require("../../routes/db.config");

const editTutorial = (req,res) =>{
    console.log(req.body)
    if(req.user){
    const username = req.user.username
    console.log(req.body)

    const { tutorialDescription, tutorialId, tutorialTitleEdit} = req.body

    db.query("SELECT * FROM tutorials WHERE tutorial_id =? AND tutorial_owner =?", [tutorialId, username], async (err,data) =>{
        if(err) throw err
        if(data){
            db.query("UPDATE tutorials SET ? WHERE tutorial_id =?", [{tutorial_title:tutorialTitleEdit, tutorial_description: tutorialDescription},tutorialId], (err, update)=>{
                if(err) throw err
                if(update){
                    res.render("successful", {status:"Tutorial Updated Succesfully", page:"/myAssets"})
                }
            })
        }else{
            res.render("error", {status:"Data does not Exist"})
        }
    })

    }
}

module.exports = editTutorial
