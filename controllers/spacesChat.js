const db = require("../routes/db.config");

const SpacesChat = async (req,res) =>{
    const SpaceId = req.params.SpaceId
    const username = req.user.username


    db.query("SELECT * FROM user_info WHERE username =?", [username], async (err, data) =>{
        if(err) throw err
        if(data[0]){
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
                        SpaceCover:"cover.jpg",
                        sender: username
                    })
                }else{
                    res.render("error", {status:"Not Found / Link Broken"})
                }

            })
        }
    })
  

}

module.exports = SpacesChat