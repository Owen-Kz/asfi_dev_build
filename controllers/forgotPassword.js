const db = require("../routes/db.config");
const transporter = require("./utils/mailTransporter");
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const sgMail = require('@sendgrid/mail')
 


const forgotPassword = async (req, res) => {

      const { email, message } = req.body;
      if(!email) return res.json({ status: "error", error: "Please fill all fields"});
      else{

      // Generate a random 6-digit ID 
      const resetToken = randomstring.generate(6);
    //   console.log(req.body)
      // Save the reset token in the database 
      db.query('UPDATE user_info SET resetToken = ? WHERE email = ?', [resetToken, email], (err) => {
        if (err) {
          console.error('Error updating resetToken:', err);
          res.json({ status:"error", message: 'Internal server error' });
        } else {
          // Create an email message 
          const emailDataH  = { email:email, message:message };
          req.session.emailData  = emailDataH
        //   console.log(emailDataH)

          // Send the email

          
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)

      const msg = {
        to: email,
        from: 'support@asfischolar.org', 
        subject: 'PASSWORD RESET TOKEN',
        // text: `Your password reset code is: ${resetToken}`,
        html: `
    
        <div class="strongText">Your password reset code is: <h2>${resetToken} </h2>
        <br> if this was not initiated by you please ignore.
        <br>Do Not Provide this code to anyone</div>`,
      }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
               res.json({status:"success", message: 'Reset token sent to your email', emailData:emailDataH});
            // res.render("confirmCode", {message:"Code has been Sent to your email", email:email})
        })
        .catch((error) => {
          console.error(error)
        })
        }
      });
    }

  };
  

  module.exports =  forgotPassword