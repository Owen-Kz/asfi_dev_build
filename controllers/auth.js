const express = require("express");
const register = require("./register")
const login = require("./login")
// const db = require("../routes/db.config");
const forgotPassword = require("./forgotPassword");
// const confrim_code = require("./confirmReset");
// const createNewPassword = require("./createNewSecret");

const router = express.Router();
router.use(express.json());


router.post("/register", register);
router.post("/login", login);


// router.post("/reset-email-confirmation",ConfrimEmailReset)
// Route for initiating the password reset process
router.post('/forgot-password', forgotPassword)

// //Confrim the Code that was sent to email
// router.post('/confirm-code', confrim_code)

// // Route for Adding the new password to the database
// router.post("/newPassword", createNewPassword)
// Add more routes for resetting the password based on the reset token
  
// router.get("/logout", (req, res) => {
//    logout
// })
module.exports = router;
// module.exports = { router, JoinRoom_ }