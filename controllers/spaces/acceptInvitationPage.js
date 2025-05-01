const db = require("../../routes/db.config")

const acceptInvitationPage =(req,res) =>{
    try{
        if(req.user){
            const SpaceId = req.params.space_id
            db.query("SELECT * FROM spaces WHERE space_id =?",[SpaceId], async(err, space)=>{
                if(err) throw err
                if(space[0]){
                    const SpaceName = space[0].space_focus
                    const SpaceDescription = space[0].space_description
                    const SpaceMembersCount = space[0].members_count
                    const SpaceCover = space[0].space_cover
                    
                    let isAdmin = "no"
                    if(space[0].space_admin == req.user.id){
                        isAdmin = "yes"
                    }

                    db.query("SELECT * FROM space_invitations WHERE (user =? OR user =? OR user = ?) AND space_id = ? ", [req.user.username, req.user.unique_code, req.user.email, SpaceId], async(err, data)=>{
                        if(err){
                            console.log(err)
                            return res.json({error:err})
                        }
                   

                        if(data[0]){
                            const response = await fetch(`${process.env.CURRENT_SCHOLAR_DOMAIN}/acceptSpaceInvitations`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({user:req.user.username, space_id:SpaceId})
                            }); 
                        
                            const acceptInvite = await response.json(); 
                         

                            if(acceptInvite.success){
                            res.render("spaceInvitationAccept", {SpaceName, SpaceDescription, SpaceMembersCount, SpaceCover,   user_first_name:req.user.first_name,
                                user_last_name:req.user.last_name,
                                username: req.user.username, user_profile_picture:req.user.profile_picture, Email:req.user.email, spaceId:SpaceId, ASFI_CODE:req.user.unique_code})
                            }else{
                                res.render("error", {error:"Page Not found", status:`${acceptInvite.error}`, message:"Invalid Space Id Provided"})
                            }

                        }else{
                            res.render("error", {error:"Page Not found", status:"Unauthorized Access", message:"Invalid Space Id Provided"})
                        // res.json({error:"unAuthorized access"})
                        }
                    })
                }else{
                    res.render("error", {error:"Page Not found", status:"Invalid Space Id Provided", message:"Invalid Space Id Provided"})
                }

                })
            // res.json({accepy:"acceptInvite"})
        }else{
            res.render("loginExternal")
        }
    }catch(error){
        console.log(error)
    res.json({error:error.message})
}
}

module.exports = acceptInvitationPage