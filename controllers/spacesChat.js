const db = require("../routes/db.config");
const SpacesChat = async (req,res) =>{
    const SpaceId = req.params.spaceid
    if(req.user){
    const username = req.user.username
    if(SpaceId){
    db.query("SELECT * FROM user_info WHERE username =?", [username], async (err, data) =>{
        if(err) throw err
        if(data[0]){
            const first_name = data[0].first_name
            const last_name = data[0].last_name
            const profile_picture = data[0].profile_picture
            db.query("SELECT * FROM space_participants WHERE username =? AND space_id =?", [username, SpaceId], async (err, DataInSpace)=>{
                if(err) throw err
                if(DataInSpace[0]){
                    console.log("Data Exists")
                }else{
                    db.query("INSERT INTO space_participants SET ?", [{username:username, space_id:SpaceId}], async(err, insert)=>{
                        if(err) throw err
                        if(insert){
                            console.log("Joined Space")
                        }
                    })
                }
            })
      
            db.query("SELECT * FROM spaces WHERE space_id =?",[SpaceId], async(err, space)=>{
                if(err) throw err
                if(space[0]){
                    const SpaceName = space[0].space_focus
                    const SpaceDescription = space[0].space_description
                    const SpaceMembersCount = space[0].members_count
                    const SpaceCover = space[0].space_cover

                    res.render("spacesChats", {SpaceName: SpaceName,
                        SpaceDescription: SpaceDescription,
                        SpaceMembersCount: SpaceMembersCount,
                        user_first_name:first_name,
                        user_last_name:last_name,
                        username: username,
                        SpaceCover:SpaceCover,
                        user_profile_picture: profile_picture,
                        sender: username,
                        spaceId: SpaceId
                    })
                }else{
                    res.render("error", {status:"Not Found / Link Broken"})
                }

            })
        }
    })
}else{
    res.render("error", {status:"Uncaught Exception"})
}
  
    }

}

module.exports = SpacesChat