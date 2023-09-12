const db = require("../routes/db.config")
const jwt = require("jsonwebtoken");
const LoggedIn = (req, res, next) => {
    if(!req.cookies.userRegistered) res.redirect("/login");
    try {
        // decrypt the cookie and retrieve user data with the id 
        const decoded = jwt.verify(req.cookies.userRegistered, process.env.JWT_SECRET) 
        db.query("SELECT * FROM user_info WHERE ID = ? ", [decoded.id], (err, result) => {
            if(err) console.log(err)

            req.user = result[0];
            // console.log(req.user)
            // console.log(req.user.username)
            next();
        })
    } catch (error) {
        if(error) return next()
        console.log(error)
    }
}

module.exports = LoggedIn;