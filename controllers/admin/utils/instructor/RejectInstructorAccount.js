
const db = require("../../../../routes/db.config");
const sendEmail = require("../../../utils/sendEmail");


const RejectInstructorAccount = async(req,res)=>{
    const {username} = req.body
    db.query("SELECT * FROM user_info WHERE username =?", [username], async (err,data) =>{
        if(err) throw err
        if(data[0]){
            const email = data[0].email
            const firstname = data[0].first_name
            SendRejectionEmail(email, firstname)
            db.query("UPDATE user_info SET ? WHERE username =?",[{account_status:'0'},username], async (err, Rejectd)=>{
                if(err) throw err
                res.json({status:"success", message:"Rejected!! An email will be sent to the user shortly"})
            })
        }else{
            res.son({status:"error", message:"User not found"})
        }
    })
}




async function SendRejectionEmail(email, firstname){
    const msgContent = `<iframe src="https://asfischolar.org/aboutUs" frameborder="0" width="100%" height="900px"></iframe>`

         
    const subject =  `Hi, ${firstname} - Request Rejection`
      // text: `Your password reset code is: ${resetToken}`,
     const message =  `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; margin: 0; padding: 0;">
      
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
                      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Your requedt to become an instructor on the ASFI Scholar platform was rejected. Please <a href="https://asfischolar.org/contactUs"> contact support</a> for assitance or resubmit your request</p>
                      
                      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">LEARN . MENTOR . COLLABORATE . PUBLISH . BE VISIBLE</p>
                  </td>
              </tr>
              
              <tr>
                  <td align="center" style="margin-top: 40px; font-size: 14px; color: #888;">
                      <p>© 2024 asfischolar.org. All rights reserved.</p>
                  </td>
              </tr>
          </table>
      
      </div>
      `
    await sendEmail(email. subject, message)
   
}
module.exports = RejectInstructorAccount