const sgMail = require("@sendgrid/mail");
const db = require("../../routes/db.config");

const bcrypt = require("bcryptjs");
const validator = require("validator");

async function getRandomString() {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var passwordLength = 15;
    var bufferID = "";
    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        bufferID += chars.substring(randomNumber, randomNumber + 1);
    }
    return bufferID
}
const register_admin = async (req, res) => {
    const { firstname, lastname, username, email, password } = req.body 
    const Npassword = password

    if(!firstname || !lastname || !username || !email || !password) return res.json({ status: "error", error: "Please fill all fields"});
      
    else{
        db.query("SELECT * FROM user_info WHERE email = ? AND acct_type = 'administrator'", [email], async (err, result) => {
            if(err) throw err;
            if(result[0]) return res.json({ status: "error", error: "A user with this Email already exists"});
         
            // The following else state,emt runs a new query to validate if a username already exists in the database
            else{
                // This first part of the else statement validates username 
                db.query("SELECT * FROM user_info WHERE username = ?", [username], async (er, user_result)  =>{ 
                    if(er) throw er;
                    if(user_result[0]) return res.json({ status: "error", error: "Username has been taken"});

                    // This second part would run only if username and email doesn't exist on the server and then Creates a new user with provided credntials   
                    else{ const password = await bcrypt.hash(Npassword, 8)
                    const bufferString  = await getRandomString()
                    db.query("INSERT INTO user_info SET ?", {
                        first_name: firstname,
                        last_name: lastname,
                        username: username,
                        email: email,
                        password: password,
                        buffer:bufferString,
                        acct_type:"administrator"}, (error, results) =>{
                        if (error) throw error;
                        console.log("Admin Created")
                        SendWelcomeEmail(email, firstname, bufferString)
                        return res.json({ status: "success", success: "Account Created Successfully. Please Login", message:"accountCreated"})
                    })   
                }       
                })
            }
           
        })

    }
}

function SendWelcomeEmail(email, firstname, buffer){
    const msgContent = `<iframe src="https://asfischolar.org/aboutUs" frameborder="0" width="100%" height="900px"></iframe>`

         
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const msg = {
      to: email,
      from: 'support@asfischolar.org', 
      subject: `Hi, ${firstname} - Admin Credentials`,
      // text: `Your password reset code is: ${resetToken}`,
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>Welcome to ASFI Scholar</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; margin: 0; padding: 0;">
      
          <!-- Header -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fff; box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); position: fixed; top: 0; left: 0; width: 100%; z-index: 1000;">
              <tr>
                  <td align="center" style="max-width: 800px; margin: 0 auto; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center;">
                      <img src="https://asfischolar.org/files/images/ASFIScholar_Logo.png" alt="Logo" style="max-width: 150px; height: auto;">
                  </td>
              </tr>
          </table>
      
          <!-- Welcome Section -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 800px; margin: 100px auto; text-align: center; padding-top: 40px; padding-bottom: 40px; background-color: #fff; border-radius: 5px; box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);">
              <tr>
                  <td>
                      <h1 style="font-size: 36px; margin-bottom: 10px;">Login with the link here:
                      <a href="https://asfischolar.org/${buffer}/admin">https://asfischolar.org/${buffer}/admin</a></h1>
                      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">LEARN . MENTOR . COLLABORATE . PUBLISH . BE VISIBLE</p>
                  </td>
              </tr>
              
              <tr>
                  <td align="center" style="margin-top: 40px; font-size: 14px; color: #888;">
                      <p>© 2024 asfischolar.org. All rights reserved.</p>
                  </td>
              </tr>
          </table>
      
      </body>
      </html>
      `,
    } 
    sgMail
      .send(msg)
      .then(() => {
        console.log('Welcome Email sent')
            //  res.status(200).json({ message: 'Reset token sent to your email' });
          // res.render("confirmCode", {message:"Code has been Sent to your email", email:email})
      })
      .catch((error) => {
        console.error(error)
      }) 
}

module.exports = register_admin;
