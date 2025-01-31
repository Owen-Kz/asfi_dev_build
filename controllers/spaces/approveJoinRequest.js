const db = require("../../routes/db.config")

const approveJoinRequest = async (req,res) =>{
    try{
        const {space_id, requested_by} = req.body
        const username = req.user.id
        if(!username){
            return res.json({error:"Username is required"})
        }
        if(!space_id){
            return res.json({error:"Space ID is required"})
        }
        if(!requested_by){
            return res.json({error:"Requested By is required"})
        }else{
            db.query("SELECT * FROM spaces WHERE space_admin = ? AND space_id  = ?", [username, space_id], async(err, spaceData)=>{
                if(err){
                    return res.json({error:err})
                }else if(spaceData[0]){
                    db.query("UPDATE space_invitations SET status = ? WHERE user = ? AND space_id = ?", ["approved", requested_by, space_id], async(err, update)=>{
                        if(err){
                            return res.json({error:err})
                        }else if(update){
                            if(update.affectedRows === 0){
                                return res.json({error:"No Request Found"})
                            }else{
                                db.query("INSERT INTO space_participants SET ?", [{username:requested_by, space_id:space_id}], async(err, insert)=>{
                                    if(err){
                                        return res.json({error:err})
                                    }else if(insert){
                                        return res.json({success:"Request Approved"})
                                    }
                                })
                            }
                            // return res.json({success:"Request Approved"})
                        }
                    })
                }
            })
        }
    }catch(error){
        console.log(error)
        return res.json({error:error.message})
    }
}


module.exports = approveJoinRequest