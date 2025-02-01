const db = require("../../routes/db.config")

const SpaceSettings = async (req,res) =>{
    const SpaceId = req.params.spaceid
    console.log(SpaceId)
    try{
    if(req.user){
    const username = req.user.username
    if(SpaceId){
    db.query("SELECT * FROM user_info WHERE username =?", [username], async (err, data) =>{
        if(err) throw err
        if(data[0]){
            const first_name = data[0].first_name
            const last_name = data[0].last_name
            const profile_picture = data[0].profile_picture
       
      
            db.query("SELECT * FROM spaces WHERE space_id =?",[SpaceId], async(err, space)=>{
                if(err) throw err
                if(space[0]){
                    const SpaceName = space[0].space_focus
                    const SpaceDescription = space[0].space_description
                    const SpaceMembersCount = space[0].members_count
                    const SpaceCover = space[0].space_cover
                  
                    if(space[0].space_admin != req.user.id){
                        res.redirect(`/spaces/${SpaceId}`)
                    }else{
                    res.render("spaceSettings", {SpaceName: SpaceName,
                        SpaceDescription: SpaceDescription,
                        SpaceMembersCount: SpaceMembersCount,
                        user_first_name:first_name,
                        user_last_name:last_name,
                        username: username,
                        SpaceCover:SpaceCover,
                        user_profile_picture: profile_picture,
                        sender: username,
                        spaceId: SpaceId,
                        chat_id: SpaceId,
                        Email:req.user.email,
                        isPrivate:space[0].is_private
                    })
                }
                }else{
                    res.render("error", {status:"Not Found / Link Broken"})
                }

            })
        }
    })
}else{
    res.render("error", {status:"Uncaught Exception"})
}
  
    }else{
        res.render("error", {status:"User Not Logged In"})
    }
    }catch(error){
        console.log(error)
        res.render("error", {status:error.message})
    }
}

module.exports = SpaceSettings