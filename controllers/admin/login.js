const db = require("../../routes/db.config");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
// const router = require("./auth");
const LoggedIn = require("./loggedin");
const generateCode = require("./generateUniqueCOde");

const login_admin = async (req, res) => {
    const { user, pass } = req.body;

    if(!user|| !pass) return res.json({ status: "error", error: "Please fill all fields"});

    else{
        db.query("SELECT * FROM user_info WHERE username = ? OR email = ? AND acct_type = 'administrator' ", [user, user], async (Err, result) => {
            if(Err) throw Err
            if(!result[0] || !await bcrypt.compare(pass, result[0].password )) return res.json({ status: "error", error: "Incorrect username / password combination"})

            else{
                const createUniqueCode = await generateCode(result[0].email)

                // console.log(createUniqueCode)
                // create cookie token
                const buffer = result[0].buffer
                const token = jwt.sign({id: result[0].id}, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES
                    // httpOnly: true
                })
                // create cookie expiry date  
                const cookieOptions = {
                    expiresIn: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                    httpOnly: true
                }
                // save cookie 
             
                res.cookie("adminRegistered", token, cookieOptions)
                return res.json({ status: "success", success: "User Logged in", loginBuffer:buffer});
            }
        });
    }

}

module.exports = login_admin;
