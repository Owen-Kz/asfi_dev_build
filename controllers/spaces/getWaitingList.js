const db = require("../../routes/db.config")

const getWaitingList = async (req, res) => {
    try{
        
        const {space_id} = req.body 
        const username = req.user.id
        if(!space_id){
            return res.json({error:"Space ID is required"})
        }else{
          db.query("SELECT * FROM spaces WHERE space_admin = ? AND space_id = ?", [username, space_id], async(err, spaceData)=>{
              if(err){
                  return res.json({error:err})
              }else if(spaceData[0]){
                  db.query("SELECT * FROM space_invitations WHERE space_id = ?", [space_id], async(err, waitingList)=>{
                      if(err){
                          return res.json({error:err})
                      }else if(waitingList[0]){
                          return res.json({success:"waitingList", waitingList})
                      }else{
                          return res.json({error:"No user in the waiting list"})
                      }
                  })
              }else{
                  return res.json({error:"You are not the admin of this space"})
              }
          })

        }

    }catch(error){
        console.log(error)
        return res.json({error:error.message})
    }
}

module.exports = getWaitingList