const db = require("../../routes/db.config")

const PresenterDetails = async (req,res) =>{
        const userEMail = req.params.email
       
        return new Promise((resolve, reject) => {
            db.query("SELECT profile_picture, username, email, first_name, last_name FROM user_info WHERE email = ? OR username = ?", [userEMail, userEMail], (err, data) => {
              if (err) { 
                console.log(err);
                resolve(res.json({error:"NO USER DATA"}));
              } else {
                if(data[0]){                 
                resolve( res.json({userDetails:data[0]})); 
                }else{
                  resolve(res.json({error:"NO USER DATA"})); 
              }
            } 
            });
          }); 
 
}
 
module.exports = PresenterDetails