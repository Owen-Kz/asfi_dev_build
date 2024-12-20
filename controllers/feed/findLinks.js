const db = require("../../routes/db.config")

const findLinks = async (username) =>{

    
     return new Promise((resolve,reject) =>{
        db.query("SELECT * FROM external_links WHERE link_owner = ? ORDER BY id DESC ", [username], async(err, data)=>{
            if(err){
                console.log(err)
                reject(err)
            }else {
                resolve(data)
            }
        })
     })  

}
 
module.exports = findLinks