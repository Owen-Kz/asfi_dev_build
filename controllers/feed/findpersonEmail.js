const db = require("../../routes/db.config")

const findPersonEmail = async (username) =>{

     
   return new Promise((resolve,reject) =>{ db.query("SELECT email, first_name, last_name FROM user_info WHERE username = ? ORDER BY id DESC ", [username], async(err, data) =>{
        if(err){
            console.log(err)
            reject(err)
        }else if(data){
    
            resolve(data)
        }else{
            reject("NoData")
        }
    })
})

}


module.exports = findPersonEmail