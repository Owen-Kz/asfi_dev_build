const jwt = require("jsonwebtoken");
const db = require("../../routes/db.config");


const ValidateLogin = async (req, res, next) => {
  // RestartConnection()
  const {token} = req.body 
  if(!token){
    return res.json({error:"Invavlid Parameters Provided"})
  }
 
  try {
    // Decrypt the cookie and retrieve user data with the id
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const decodedAdmin = jwt.verify(token, process.env.JWT_SECRET_ADMIN)

    db.query("SELECT * FROM user_info WHERE id = ?", [decoded.id], (err, result) => {
      if (err) {
        console.log(err);
        return res.json({error:err})
      }

      req.user = result[0];
      return res.json({userInfo:req.user})
    });

   

    // clearInterval(disconnectTimer);
  } catch (error) {
    return res.json({error:error})
  }

};

module.exports = ValidateLogin;
