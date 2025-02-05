const db = require("../../routes/db.config")

const GetUsersToInvite = (req,res) =>{
    const spaceID = req.params.space_id

    try{
        db.query(`SELECT * 
FROM user_info u
WHERE NOT EXISTS (
    SELECT 1 
    FROM space_invitations si
    WHERE si.user = u.username 
    AND si.space_id = ?
)
AND NOT EXISTS (
    SELECT 1 
    FROM space_participants sp
    WHERE sp.username = u.username 
    AND sp.space_id = ?
)
`, [spaceID, spaceID], async (err,data) =>{
    if(err){
        console.log(err)
        return res.json({error:err})
    }else{
        return res.json({success:"userData", userData:data})
    }
})

    }catch(error){
        console.log(error)
        res.json({error:error.message})
    }
}


module.exports = GetUsersToInvite