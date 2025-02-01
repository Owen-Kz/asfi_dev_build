const db = require("../../routes/db.config")

const updateSpaceData  = async (req,res) =>{
    try{
        const userId = req.user.id 
        const {space_id, space_title, space_description, makePrivate} = req.body 
        console.log(req.body)
    
        db.query("UPDATE spaces SET ? WHERE space_admin =? AND space_id = ?", [{space_focus:space_title, space_description:space_description, is_private:makePrivate}, userId, space_id], async (err, data) =>{
            if(err){
                console.log(err)
                return res.json({error:err})
            }else if(data.affectedRows > 0){
                return res.json({success:"Space Updates" })
            }else{
                return res.json({error:"Could not retreive space data"})
            }
        })
    }
    catch(error){
        console.log(error)
        res.json({error:error.message})
 }
}

module.exports = updateSpaceData



