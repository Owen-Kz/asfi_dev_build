const sgMail = require("@sendgrid/mail");

function SendWelcomeEmail(email,fullname, subject, message){
 
    sgMail.setApiKey(process.env.SENDGRID_API_KEY_ALPHA)

    const msg = {
        to: {
            email: email,
            name: fullname  // Add receiver's name here
          },
          from: {
            email: "no-reply@alphaforexlyfe.pro",
            name: "Alpha Forex Lyfe"  // Optionally, you can also add sender's name
          },
      subject: `${subject}`,
      html: `${message}`
    }  
    sgMail
      .send(msg)
      .then(() => {
        console.log('Welcome Email sent for Alpha')
            //  res.status(200).json({ message: 'Reset token sent to your email' });
          // res.render("confirmCode", {message:"Code has been Sent to your email", email:email})
      })
      .catch((error) => {
        console.error(error)
      }) 
} 

module.exports = SendWelcomeEmail 