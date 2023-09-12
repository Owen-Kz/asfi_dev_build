const db = require("../routes/db.config");

const Directory = (req, res) => {
  if (req.user) {
    const username_new = req.user.username
    db.query("SELECT * FROM user_info WHERE username =?",[username_new], (err, result)=>{
if(err) throw err
  if(result[0]){
    const accountType = result[0].acct_type
    
            res.render("directory.ejs", {
              root: "./public/directory",
              status: "logged",
              dataJSON: "[]",
              dataUnfollowed: "[]", // Pass the JSON string to the template
              user: username_new,
              accountType:accountType,
            });
          }
   })  
}
}

module.exports = Directory;
