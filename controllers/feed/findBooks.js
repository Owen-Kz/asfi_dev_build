const db = require("../../routes/db.config")

const findBooks = (username) =>{

       return new Promise((resolve, reject) =>{
            db.query("SELECT * FROM books WHERE book_author = ? ORDER BY id DESC ", [username], async(err, data)=>{
                if(err){
                    console.log(err)
                    reject(err)
                }else{
                    resolve(data)
                }
            })
        })
      
  
}

module.exports = findBooks