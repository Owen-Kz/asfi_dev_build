const db = require("../../routes/db.config");

const editPublication = (req,res) =>{
    console.log(req.body)
    if(req.user){
    const username = req.user.username

    const {publicationID, publicationURLEdit} = req.body

    db.query("SELECT * FROM external_links WHERE link_buffer =? AND link_owner =?", [publicationID, username], async (err,data) =>{
        if(err) throw err
        if(data){
            db.query("UPDATE external_links SET ? WHERE link_buffer =?", [{link_href:publicationURLEdit},publicationID], (err, update)=>{
                if(err) throw err
                if(update){
                    res.render("successful", {status:"Publication Updated Succesfully", page:"/myAssets"})
                }
            })
        }else{
            res.render("error", {status:"Data does not Exist"})
        }
    })

    }
}

module.exports = editPublication