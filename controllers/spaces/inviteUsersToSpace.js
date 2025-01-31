const db = require("../../routes/db.config")

const inviteUserToSpace = async (req,res) =>{
    try{
        const {space_id, userEmail} = req.body
        const username = req.user.id

        db.query("SELECT * FROM spaces WHERE space_admin = ? AND space_id = ?", [username, space_id], async(err, spaceData)=>{  
            if(err){
                return res.json({error:err})
            }else if(spaceData[0]){
                db.query("SELECT * FROM user_info WHERE email = ? OR username = ?", [userEmail, userEmail], async(err, userData)=>{
                    if(err){
                        return res.json({error:err})
                    }else if(userData[0]){
                        db.query("INSERT INTO space_invitations SET ?", [{username:userData[0].username, space_id:space_id, status:"invited"}], async(err, insert)=>{
                            if(err){
                                return res.json({error:err})
                            }else if(insert){
                                return res.json({success:"User added to the waiting room"})
                            }
                        })
                    }else{
                        return res.json({error:"User not found"})
                    }
                })
            }else{
                return res.json({error:"You are not the admin of this space"})
            }
        })
    }catch(error){
        console.log(error)
        return res.json({error:error.message})
    }
}


module.exports = inviteUserToSpace