const db = require("../../routes/db.config")
const dbPromise = require("../../routes/dbPromise.config")

const deleteSpace = async (req,res) =>{
    try{
        const userid = req.user.id
        const SpaceId = req.params.space_id
        db.query("SELECT * FROM spaces WHERE space_id =?",[SpaceId], async(err, space)=>{
            if(err) throw err
            if(space[0]){
                const SpaceName = space[0].space_focus
                const SpaceDescription = space[0].space_description
                const SpaceMembersCount = space[0].members_count
                const SpaceCover = space[0].space_cover
              
                if(space[0].space_admin != req.user.id && req.user.acct_type !== "administrator"){ 
                    // res.redirect(`/spaces/${SpaceId}`)
                    return res.json({error:"Unauthorized Access"})
                }else{
                    db.query("DELETE FROM spaces WHERE space_id = ?", [SpaceId], async(err, deleted)=>{
                        if(err){
                           
                            return res.json({error:err})
                        }else{
                            const deleteParticipants = await dbPromise.query("DELETE FROM space_participants WHERE space_id = ?", [SpaceId])
                            const deleteInvitations = await dbPromise.query("DELETE FROM space_invitations WHERE space_id = ?", [SpaceId])
                            const deleteMessages = await dbPromise.query("DELETE FROM spaces_messages WHERE buffer = ?", [SpaceId])
                            return res.json({success:"Space Deleted Succesfully"})
                        }
                    })
                }
            }
            })
    

    }catch(error){
        return res.json({error:error.message})
    }
}

module.exports = deleteSpace