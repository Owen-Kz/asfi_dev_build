const db = require("../../../../routes/db.config");
const sgMail = require('@sendgrid/mail')


const ApproveInstructorAccount = async(req,res)=>{

    const {username} = req.body
    db.query("SELECT * FROM user_info WHERE username =?", [username], async (err,data) =>{
        if(err) throw err
        if(data[0]){
            const email = data[0].email
            const firstname = data[0].first_name

           SendApprovalEmail(email, firstname)

            db.query("UPDATE user_info SET ? WHERE username =?",[{account_status:'3', acct_type:'instructor_Account'},username], async (Err, approved)=>{
                if(Err) throw err
                if(approved[0]){
                    console.log(username)
                res.json({status:"success", message:"Approved! An email will be sent to the user shortly"})
                }
            })
        }else{
            res.son({status:"error", message:"User not found"})
        }
    })
}

 function SendApprovalEmail(email, firstname){
    const msgContent = `<iframe src="https://asfischolar.org/aboutUs" frameborder="0" width="100%" height="900px"></iframe>`

         
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const msg = {
      to: email,
      from: 'support@asfischolar.org', 
      subject: `Hi, ${firstname} - Request Approval`,
      // text: `Your password reset code is: ${resetToken}`,
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>Instructor Request Approval</title>
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
                      <h1 style="font-size: 36px; margin-bottom: 10px;">Hi, ${firstname}</h1>
                      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Your requedt to become an instructor on the ASFI Scholar platform has been approved</p>
                      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                      Please <a href="https://asfischolar.org/login">Proceed to login</a>
                      or open this link in your browser:
                      <a href="https://asfischolar.org/login">https://asfischolar.org/login</a>
                      </p>
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
        console.log('Instructor Approval Email Sent')
            //  res.status(200).json({ message: 'Reset token sent to your email' });
          // res.render("confirmCode", {message:"Code has been Sent to your email", email:email})
      })
      .catch((error) => {
        console.error(error)
      }) 
}

module.exports = ApproveInstructorAccount