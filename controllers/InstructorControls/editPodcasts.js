const db = require("../../routes/db.config");

const editPodcast = (req,res) =>{
    console.log(req.body)
    if(req.user){
    const username = req.user.username

    const {podcastId, podcastTitleEdit} = req.body

    db.query("SELECT * FROM podcasts WHERE buffer =? AND podcast_owner =?", [podcastId, username], async (err,data) =>{
        if(err) throw err
        if(data){
            db.query("UPDATE podcasts SET ? WHERE buffer =?", [{podcast_title:podcastTitleEdit},podcastId], (err, update)=>{
                if(err) throw err
                if(update){
                    res.render("successful", {status:"Podcast Updated Succesfully", page:"/myAssets"})
                }
            })
        }else{
            res.render("error", {status:"Data does not Exist"})
        }
    })

    // res.json({Request: req.body})
    }
}

module.exports = editPodcast