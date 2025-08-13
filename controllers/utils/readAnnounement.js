const dbPromise = require("../../routes/dbPromise.config")

const readAnnouncement = async (req,res) =>{
try{
    const id = req.params.id 
    // Check if the user has alread read the announcment 
    const findAnnouncment = await dbPromise.query("SELECT * FROM read_announcement WHERE user_id = ? AND announcement_id = ?", [req.user.id, id])
    if(findAnnouncment[0].length > 0){
        return res.json({success:"Already read announcment"})
    }
    // Create new entry if not exist 
    await dbPromise.query("INSERT INTO read_announcement SET ?",[{user_id:req.user.id, announcement_id:id}])
    return res.json({success:"Announcment Read Successfully"})
}catch(error){
    console.log(error)
    return res.json({error:error.message?error.message:error})
}
}

module.exports = readAnnouncement