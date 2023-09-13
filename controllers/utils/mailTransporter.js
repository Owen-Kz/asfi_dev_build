const nodemailer = require("nodemailer")
// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ejikemestella74@gmail.com',
      pass: 'OmoleyeStella..',
    },
  });
 
// Local SMTP server
// const transporter = nodemailer.createTransport({
//     host: 'localhost',
//     port: 1025,
//     ignoreTLS: true,
//   });
 

//   online smpty host 
// const transporter = nodemailer.createTransport({
//     host: 'your-smtp-hostname', // Replace with your SMTP server hostname
//     port: 587, // Replace with the port your SMTP server uses (587 for TLS, 465 for SSL)
//     secure: false, // Set to true for SSL; false for TLS
//     auth: {
//       user: 'your-smtp-username', // Replace with your SMTP username
//       pass: 'your-smtp-password', // Replace with your SMTP password
//     },
//   });
  module.exports = transporter  