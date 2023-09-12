const db = require("../routes/db.config")

const render_main_room = async (req, res) => {
    const meeting_id = req.params["roomId"]
    const userId = req.params["userId"]


    
       db.query("SELECT * FROM `active_video_calls` WHERE ?",[{meeting_id:meeting_id}], (err, result)=>{
            if (err) throw err
            if(result[0]){
            const meetingTitle = result[0]["meeting_title"]
            const meeting_Host = result[0]["meeting_host"]
            const date_scheduled = result[0]["date_scheduled_for"]
    
        // Send the redirection URL as a response to the client if the user has an account
        db.query("SELECT * FROM `user_info` WHERE buffer =?", [userId], (err,user_Result) =>{
            if(err) throw err
            if(user_Result[0]){
                const FirstName = user_Result[0]["first_name"]
                const lastName = user_Result[0]["last_name"]
                const account_buffer = user_Result[0]["buffer"]
                const account_type = user_Result[0]["acct_type"]

                res.render("room", {meeting_id:meeting_id, meetingHost:meeting_Host, date_scheduled:date_scheduled, meetingTitle:meetingTitle, FirstName:FirstName, lastName:lastName, account_type:account_type, buffer:account_buffer})
            }else{
                res.render("room", {meeting_id:meeting_id, meetingHHost:meeting_Host, date_scheduled:date_scheduled, meetingTitle:meetingTitle, buffer:userId})

            }
        })
    
            }else{
                res.render("error", {status:"This meeting doesn't exist or Might have been closed"})
            }
        }) 
    }
    module.exports = render_main_room