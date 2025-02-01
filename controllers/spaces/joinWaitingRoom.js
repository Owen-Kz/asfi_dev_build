const db = require("../../routes/db.config")

const joinSpaceWaitingRoom = async (req, res) => {
    try{
        const {space_id} = req.body 
        const username = req.user.username
        if(!username){
            return res.json({error:"Username is required"})
        }
        if(!space_id){
            return res.json({error:"Space ID is required"})
        }else{
            
            db.query("SELECT * FROM space_invitations WHERE user =? AND space_id =?", [username, space_id], async(err, spaceData)=>{
                if(err) throw err
                if(spaceData[0]){
                    return res.json({success:"User already in the waiting room"})
                }else{
                    db.query("INSERT INTO space_invitations SET ?", [{user:username, space_id:space_id, status:"requested"}], async(err, insert)=>{
                        if(err) throw err
                        if(insert){
                            return res.json({success:"User added to the waiting room"})
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

module.exports = joinSpaceWaitingRoom