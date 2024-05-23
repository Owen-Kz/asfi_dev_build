const db = require("../../routes/db.config");

const DeleteTutorial = (req,res) =>{

    if(req.user){
    const username = req.user.username
 
    const {tutorialDeleteId} = req.body
    
    db.query("SELECT * FROM tutorials WHERE tutorial_id =? AND tutorial_owner =?", [tutorialDeleteId, username], async (err,data) =>{
        if(err) throw err
        if(data){
            db.query("DELETE FROM tutorials WHERE tutorial_id =?", [tutorialDeleteId], (err, update)=>{
                if(err) throw err
                if(update){
                    res.render("successful", {status:"Tutorial Deleted Succesfully", page:"/myAssets"})
                }
            })
        }else{
            res.render("error", {status:"Data does not Exist"})
        }
    })


    }
}

module.exports = DeleteTutorial