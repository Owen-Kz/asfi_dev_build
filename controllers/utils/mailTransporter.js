const nodemailer = require("nodemailer")
// Create a transporter for sending emails
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'ejikemestella74@gmail.com',
//       pass: 'OmoleyeStella..',
//     },
//   });
 
// Local SMTP server
// const transporter = nodemailer.createTransport({
//     host: 'localhost',
//     port: 1025,
//     ignoreTLS: true,
//   });
 

//   online smpty host 
// const transporter = nodemailer.createTransport({
//     host: 'smtp.mailgun.org',
//     port: 587, // Replace with the port your SMTP server uses (587 for TLS, 465 for SSL)
//     secure: false, // Set to true for SSL; false for TLS
//     auth: {
//       user: ' postmaster@sandboxf0c4959f1fbf423ca1cc0422b501a59e.mailgun.org', // Replace with your SMTP username
//       pass: '596259b0b23c467fb17330c1c98c7e10-7ecaf6b5-c942ded5', // Replace with your SMTP password
//     },
//   }); 

const sgMail = require('@sendgrid/mail')

const transporter = (req, res) => {
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const msg = {
  to: 'test@example.com', // Change to your recipient
  from: 'support@asfischolar.org', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })

}
  module.exports = transporter  