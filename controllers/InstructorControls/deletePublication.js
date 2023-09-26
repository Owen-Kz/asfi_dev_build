const db = require("../../routes/db.config");

const DeletePublication = (req,res) =>{

    if(req.user){
    const username = req.user.username
    const {publicationIdDelete} = req.body

        
    db.query("SELECT * FROM external_links WHERE link_buffer =? AND link_owner =?", [publicationIdDelete, username], async (err,data) =>{
        if(err) throw err
        if(data){
            db.query("DELETE FROM external_links WHERE link_buffer =?", [publicationIdDelete], (err, update)=>{
                if(err) throw err
                if(update){
                    res.render("successful", {status:"Publication Deleted Succesfully", page:"/myAssets"})
                }
            })
        }else{
            res.render("error", {status:"Data does not Exist"})
        }
    })
    }
}

module.exports = DeletePublication