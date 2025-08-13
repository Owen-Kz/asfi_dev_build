const dbPromise = require("../../routes/dbPromise.config")

const readAnnouncmentCheck = async (userId, announcementId) =>{
try{
const checkisRead = await dbPromise.query("SELECT * FROM read_announcement WHERE user_id = ? AND announcement_id = ?", [userId, announcementId])

if(checkisRead[0].length > 0){
    return true
}else{
    return false
}
}catch(error){
    console.log(error)
    return false
}
}

module.exports = readAnnouncmentCheck