const db = require("../../routes/db.config");

const RestartConnection = async (req,res)=>{
    db.connect(err => {
        if (err) {
          console.error('Error connecting to database:', err);
        }else{
            console.log("Reconnected")
        }
    })
}


module.exports = RestartConnection