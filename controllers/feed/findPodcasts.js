const db = require("../../routes/db.config")

const findPodcasts = async (username) =>{

       return new Promise((resolve,reject) =>{
        db.query("SELECT * FROM podcasts WHERE podcast_owner = ? ORDER BY id DESC ", [username], async(err, data)=>{
            if(err){
                console.log(err)
                reject(err)
            }else {
                resolve(data)
            }
        })
       })
 
}

module.exports = findPodcasts