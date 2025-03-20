const db = require("../../routes/db.config")

const findPersonEmail = async (username) =>{

     
   return new Promise((resolve,reject) =>{ db.query("SELECT email, first_name, last_name, username FROM user_info WHERE username = ? ORDER BY id DESC ", [username], async(err, data) =>{
        if(err){
            console.log(err)
            reject(err)
        }else if(data[0]){
    
    
            resolve(data)
        }else{
            resolve("NoData")
        }
    })
})

}


module.exports = findPersonEmail