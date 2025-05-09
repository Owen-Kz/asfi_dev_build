
const jwt = require("jsonwebtoken");
const db = require("../../routes/db.config");

const AdminLoggedIn = (req, res, next) => {
  if (!req.cookies.adminRegistered) {
    // Redirect to home if user is not logged in
    if (req.path === '/becomeInstructor') {
        // Skip the middleware for the '/becomeInstructor' route
        return next();
      }else{
    return res.redirect("/admin/sign-in");
      }
  }

  try {
    // Decrypt the cookie and retrieve user data with the id
    const decoded = jwt.verify(req.cookies.adminRegistered, process.env.JWT_SECRET);

    db.query("SELECT * FROM user_info WHERE id = ? AND acct_type = 'administrator' ", [decoded.id], (err, result) => {
      if (err) {
        console.log(err);
        return res.redirect("/admin/sign-in"); // Redirect to home on error
      }

      req.admin = result[0];
      next();
    });
  } catch (error) {
    console.log(error);
    res.redirect("/admin/sign-in"); // Redirect to home on error
  }
};

module.exports = AdminLoggedIn;
