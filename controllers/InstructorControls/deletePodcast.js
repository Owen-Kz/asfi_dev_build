const db = require("../../routes/db.config");

const DeletePodcast = (req,res) =>{

    if(req.user){
    const username = req.user.username

    const {podcastIdDelete} = req.body
    
    db.query("SELECT * FROM podcasts WHERE buffer =? AND podcast_owner =?", [podcastIdDelete, username], async (err,data) =>{
        if(err) throw err
        if(data){
            db.query("DELETE FROM podcasts WHERE buffer =?", [podcastIdDelete], (err, update)=>{
                if(err) throw err
                if(update){
                    res.render("successful", {status:"Podcast Deleted Succesfully", page:"/myAssets"})
                }
            })
        }else{
            res.render("error", {status:"Data does not Exist"})
        }
    })

    }
}

module.exports = DeletePodcast