const db = require("../../routes/db.config")

const getProfileForSiteMap = async (req,res) =>{
    return new Promise((resolve, reject) =>{
        db.query("SELECT * FROM user_info ", async(err, data) =>{
            if(err){
                reject(err)
            }
            resolve(data)
        })
    })
}


module.exports = getProfileForSiteMap