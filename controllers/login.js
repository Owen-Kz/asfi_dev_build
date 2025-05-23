const db = require("../routes/db.config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const router = require("./auth");
const LoggedIn = require("./loggedin");
const RestartConnection = require("./utils/restartConnection");
const generateCode = require("./admin/generateUniqueCOde");
const updateUserLocation = require("./admin/UpdateUserLocation");

const login_user = async (req, res) => {
    // await RestartConnection()

    const { user, pass } = req.body;
    
    if(!user|| !pass) return res.json({ status: "error", error: "Please fill all fields"});

    else{ 
 
    try{
       db.query('SELECT * FROM user_info WHERE (username = ? OR email =?) AND (account_status = "1" OR account_status = "3")', [user, user], async (Err, result) => {
            if(Err) throw Err
            if(!result[0] || !await bcrypt.compare(pass, result[0].password )) return res.json({ status: "error", error: "Incorrect username / password combination"})

            else{
                const createUniqueCode = await generateCode(result[0].email)
                await updateUserLocation(req,res, result[0].id)
                
                // create cookie token
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
             
                res.cookie("userRegistered", token, cookieOptions)
                return res.json({ status: "success", success: "User Logged in", userToken:token});
            }
        })
} catch (error) {
  throw new Error('Error executing query: ' + error.message);
}
    }

}

module.exports = login_user;
