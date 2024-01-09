const db = require("../../routes/db.config");

const bcrypt = require("bcryptjs");
const validator = require("validator");

const register_admin = async (req, res) => {
    const { firstname, lastname, username, email, password: Npassword } = req.body
    if(!firstname || !lastname || !username || !email || !Npassword) return res.json({ status: "error", error: "Please fill all fields"});

    if (!validator.isEmail(email)) return res.json({ status: "error", error: "Please provide a valid email" });
      
    else{
        db.query("SELECT * FROM admin_accounts WHERE email = ?", [email], async (err, result) => {
            if(err) throw err;
            if(result[0]) return res.json({ status: "error", error: "A user with this Email already exists"});
         
            // The following else state,emt runs a new query to validate if a username already exists in the database
            else{
                // This first part of the else statement validates username 
                db.query("SELECT * FROM admin_accounts WHERE username = ?", [username], async (er, user_result)  =>{ 
                    if(er) throw er;
                    if(user_result[0]) return res.json({ status: "error", error: "Username has been taken"});

                    // This second part would run only if username and email doesn't exist on the server and then Creates a new user with provided credntials   
                    else{ const password = await bcrypt.hash(Npassword, 8)
                    db.query("INSERT INTO admin_accounts SET ?", {first_name: firstname, last_name: lastname, username: username, email: email, password: password}, (error, results) =>{
                        if (error) throw error;
                        return res.json({ status: "success", success: "Account Created Successfully. Please Login"})
                    })   
                }       
                })
            }
           
        })

    }
}

module.exports = register_admin;
