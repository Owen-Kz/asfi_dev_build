const db = require("../routes/db.config");

const getSpaces = async (req,res) =>{
   
   if(req.user){ 
          const username = req.user.username
      db.query("SELECT * FROM spaces WHERE 1 AND isFromPoster != ?",["true"], async(err, spacesData)=>{
        if(err) throw err
        if(spacesData[0]){
        res.json({message:"Spaces Found", spacesArray: spacesData})  
        }
      })
    }
}

module.exports = getSpaces