const db = require("../../routes/db.config")

const findUserByName = async (user) =>{
      return new Promise((resolve, reject) => {
        db.query("SELECT * FROM user_info WHERE username =?", [user], async (err, data)=>{
            if(err){
                reject(err)
               }else{
                if(data[0]){
                resolve(data[0])
                }else{
                resolve([])
                }
            }
        })
      })
}

module.exports = findUserByName