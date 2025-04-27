const db = require("../routes/db.config");
const JoinSpace = require("./spaces/joinSpace");
const SpacesChat = async (req,res) =>{
    const SpaceId = req.params.spaceid
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
                    const PassKey = space[0].space_passkey
                    let isAdmin = "no"
                    if(space[0].space_admin == req.user.id){
                        isAdmin = "yes"
                    }
                    // check if the user is already part of the space 
                    function renderSpace(){
                        res.render("app-chat-spaces", {SpaceName: SpaceName,
                            SpaceDescription: SpaceDescription,
                            SpaceMembersCount: SpaceMembersCount,
                            user_first_name:first_name,
                            user_last_name:last_name,
                            username: username,
                            UserName: username,
                            SpaceCover:SpaceCover,
                            user_profile_picture: profile_picture,
                            sender: username,
                            spaceId: SpaceId,
                            chat_id: SpaceId,
                            Email:req.user.email,
                            isAdmin:  isAdmin,
                            PassKey: PassKey,
                            logger:"logged", user :req.user.username, ProfileImage:req.user.profile_picture, UserFirstname:req.user.first_name, UserLastName:req.user.last_name, Course:"Course", CourseYear:"CourseYear", accountType:req.user.acct_type, UserName:req.user.username, username:req.user.username, Username:req.user.username, UserName:req.user.username, ASFI_CODE:req.user.unique_code
                        })
                    }
                    function renderVerify(){
                        res.render("spaceVerification", {SpaceName: SpaceName,
                            SpaceDescription: SpaceDescription,
                            SpaceMembersCount: SpaceMembersCount,
                            user_first_name:first_name,
                            user_last_name:last_name,
                            username: username,
                            UserName: username,
                            SpaceCover:SpaceCover,
                            user_profile_picture: profile_picture,
                            sender: username,
                            spaceId: SpaceId,
                            chat_id: SpaceId,
                            Email:req.user.email,
                            logger:"logged", user :req.user.username, ProfileImage:req.user.profile_picture, UserFirstname:req.user.first_name, UserLastName:req.user.last_name, Course:"Course", CourseYear:"CourseYear", accountType:req.user.acct_type, UserName:req.user.username, username:req.user.username, Username:req.user.username, UserName:req.user.username, ASFI_CODE:req.user.unique_code
                        })
                    }
               
                    db.query("SELECT * FROM space_participants WHERE username = ? AND space_id =?", [req.user.username, SpaceId],async (err, data) =>{
                        if(err){
                            return res.json({error:err})
                        }
                        if(data[0]){
                            renderSpace()
                        }else if(space[0].is_private === "yes" && space[0].space_admin != req.user.id){
                            renderVerify()
                                }else{
                                await JoinSpace(SpaceId, req.user.username)
                               renderSpace()
                            }
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
  
    }else{
        res.render("error", {status:"User Not Logged In"})
    }
    }catch(error){
        console.log(error)
        res.render("error", {status:error.message})
    }
}

module.exports = SpacesChat