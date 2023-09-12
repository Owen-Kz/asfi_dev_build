const db = require("../routes/db.config");
const transporter = require("./utils/mailTransporter");
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');


const forgotPassword = async (req, res) => {
    try { 
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
          res.status(500).json({ message: 'Internal server error' });
        } else {
          // Create an email message 
          const emailDataH = req.session.emailData = { email:email, message:message };
        //   console.log(emailDataH)

          const mailOptions = {
            from: 'suport@asfischolar.com',
            to: email,
            subject: 'PASSWORD RESET TOKEN',
            text: `Your password reset code is: ${resetToken}`,
          };
  
          // Send the email
          transporter.sendMail(mailOptions, (error) => {
            if (error) {
              console.error('Error sending email:', error);
            //   res.status(500).json({ message: 'Internal server error' });
              console.log("Internal Server Error")
            } else {
            //   console.log("Mail")
              // Save data to the session
             
              res.status(200).json({ message: 'Reset token sent to your email' });
            // res.render("confirmCode", {message:"Code has been Sent to your email", email:email})
            }
          });
        }
      });
    }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

  module.exports =  forgotPassword