const db = require("../routes/db.config");
const sendEmail = require("./utils/sendEmail");
const generateResetToken = require("./admin/generateResetToken");
const dbPromise = require("../routes/dbPromise.config");
 


const forgotPassword = async (req, res) => {
  const currentYear = new Date().getFullYear();
      const { email, message } = req.body;
  const checkIfUSERExists = await dbPromise.query("SELECT * FROM user_info WHERE email = ?", [email])
  if(checkIfUSERExists[0].length > 0){


      if(!email) return res.json({ status: "error", error: "Please fill all fields"});
      else{

      // Generate a random 6-digit ID 
      const resetToken = await generateResetToken();

    //   console.log(req.body)
      // Save the reset token in the database 
      db.query('UPDATE user_info SET resetToken = ? WHERE email = ?', [resetToken, email],async (err) => {
        if (err) {
          console.error('Error updating resetToken:', err);
        return  res.json({ status:"error", message: 'Internal server error' });
        } else {
          // Create an email message 
          const emailDataH  = { email:email, message:message };
   
        //   console.log(emailDataH)
        // create cookie token

      // create cookie expiry date 
      const cookieOptions = {
          expiresIn: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
          httpOnly: true
      }
      // save cookie 
  
      res.cookie("resetPasswordData", JSON.stringify(emailDataH), cookieOptions)
          // Send the email

          
      // sgMail.setApiKey(process.env.SENDGRID_API_KEY)

      // const msg = {
      //   to: email,
      //   from: 'support@asfischolar.org', 
      //   subject: 'PASSWORD RESET TOKEN',
      //   // text: `Your password reset code is: ${resetToken}`,
      //   html: `
    
      // `,
      // }
      // Send Message With brevo 
      const subject = "PASSWORD RESET TOKEN"
      const mainMessage = `  
      <html>
      <body>
      <div class="strongText">Your password reset code is: <h2>${resetToken} </h2>
        <br> if this was not initiated by you please ignore.
        <br>Do Not Provide this code to anyone</div>
          <p>© ${currentYear} asfischolar.org. All rights reserved.</p>
          <script>
        document.addEventListener('DOMContentLoaded', function () {
          const loader = document.getElementById('custom-loader');
    
              setTimeout(() => {
                loader.classList.add('hide');
              }, 500); // optional delay for smoother transition
            
          });
      
      </script>
</body>

          </html>
          `
      await sendEmail(email,subject, mainMessage)
     return res.json({status:"success", message: 'Reset token sent to your email', emailData:JSON.stringify(emailDataH)});
      // res.render("confirmCode", {message:"Code has been Sent to your email", email:email})
      // sgMail
      //   .send(msg)
      //   .then(() => {
      //     console.log('Email sent')
             
      //   })
      //   .catch((error) => {
      //     console.error(error)
      //   })
        }
      });
    }
  }else{
 
    return res.json({status:"error", message: 'This User Does not exist'})
  }
  };
  

  module.exports =  forgotPassword