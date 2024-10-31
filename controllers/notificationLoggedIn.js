const db = require("../routes/db.config");
const jwt = require("jsonwebtoken");

const NotificationLoggedIN = async (req, res, next) => {
    const Token = req.cookies.userRegistered
   
  try {
    if(Token  && Token !== ""){

          const cookieOptions = {
                    expiresIn: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                    httpOnly: true
                }
                // save cookie 
             
                res.cookie("userRegistered", Token, cookieOptions)
    
    // Decrypt the cookie and retrieve user data with the id
    const decoded = jwt.verify(Token, process.env.JWT_SECRET);

    db.query("SELECT * FROM user_info WHERE id = ? ", [decoded.id], (err, result) => {
      if (err) {
        console.log(err);
        return res.redirect("/home"); // Redirect to home on error
      }
      
      req.user = result[0];
      next();
    });

}else{
    next();
}

    // clearInterval(disconnectTimer);
  } catch (error) {
    console.log(error);
    res.redirect("/home"); // Redirect to home on error
  }

};

module.exports = NotificationLoggedIN;
