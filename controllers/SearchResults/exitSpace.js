const db = require("../../routes/db.config");

const ExitSpace = (req,res) =>{
    const Username = req.user.username
    const Spaceid = req.params.spaceid
    db.query("SELECT * FROM space_participants WHERE username =? AND space_id =?", [Username, Spaceid], async (err, data) =>{
        if(err) throw err
        if(data[0]){
            db.query("DELETE FROM space_participants WHERE username = ? AND space_id = ?", [Username, Spaceid], async(err, deleted) =>{
                if(err) throw err
                if(deleted){
             res.json({message:"You left this space"})
                
                }
            })
        }
    })

}

module.exports = ExitSpace