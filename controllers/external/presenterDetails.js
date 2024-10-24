const db = require("../../routes/db.config")

const PresenterDetails = async (req,res) =>{
        const userEMail = req.params.email
       
        return new Promise((resolve, reject) => {
            db.query("SELECT profile_picture, username, email, first_name, last_name FROM user_info WHERE email = ?", [userEMail], (err, data) => {
              if (err) { 
                console.log(err);
                reject(err); // Reject the promise with the error
              } else { 
                if(data[0]){                 
                resolve( res.json({userDetails:data[0]})); 
                }else{
                  resolve(res.json({error:"NO USErDATA"})); 
              }
            }
            });
          });

}
 
module.exports = PresenterDetails