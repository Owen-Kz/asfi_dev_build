const db = require("../routes/db.config");
const jwt = require("jsonwebtoken");
const RestartConnection = require("./utils/restartConnection");

const LoggedIn = async (req, res, next) => {
  // RestartConnection()
  if (!req.cookies.userRegistered) {
    // Redirect to home if user is not logged in
    if (req.path === '/becomeInstructor') {
        // Skip the middleware for the '/becomeInstructor' route
        return next();
      }else{
    return res.redirect("/home"); 
      }
  }
 
  try {
    // Decrypt the cookie and retrieve user data with the id
    const decoded = jwt.verify(req.cookies.userRegistered, process.env.JWT_SECRET);
    console.log(decoded)
    console.log(decoded.id)
    db.query("SELECT * FROM user_info WHERE id = ? ", [decoded.id], (err, result) => {
      if (err) {
        console.log(err);
        return res.redirect("/home"); // Redirect to home on error
      }

      req.user = result[0];
    console.log(req.user)

      next();
    });

   

    // clearInterval(disconnectTimer);
  } catch (error) {
    console.log(error);
    res.redirect("/home"); // Redirect to home on error
  }

};

module.exports = LoggedIn;
