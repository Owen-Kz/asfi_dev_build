const db = require("../routes/db.config");
const jwt = require("jsonwebtoken");

const LoggedIn = (req, res, next) => {


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
    db.query("SELECT * FROM user_info WHERE ID = ? ", [decoded.id], (err, result) => {
      if (err) {
        console.log(err);
        return res.redirect("/home"); // Redirect to home on error
      }

      req.user = result[0];
      next();
    });
  } catch (error) {
    console.log(error);
    res.redirect("/home"); // Redirect to home on error
  }
};

module.exports = LoggedIn;
