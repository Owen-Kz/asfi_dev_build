const db = require("../routes/db.config");


const JoinRoom = (req, res) => {
    const {meeting_id, passcode, firstname, lastname, profile_picture, account_type, user_id, user_secret} = req.body;

    const meeting_id_main = req.body[0].meeting_id
    const userIdMain = req.body[0].user_id
    const firstName = req.body[0].firstname
    const lastName = req.body[0].lastname
    const profilePicture = req.body[0].profile_picture
    const passCode = req.body[0].passcode
    const accountType = req.body[0].account_type
    const userSecret = req.body[0].user_secret

    const redirectUrl = `/meetings/m/${meeting_id_main}/u/${userSecret}`;
    
    try {

        db.query("SELECT * FROM `active_video_calls` WHERE ? AND ?",[{meeting_id:meeting_id_main},{pass_code:passCode}], (err, result)=>{
            if (err) throw err
            if(result[0]){
            const meetingTitle = result[0]["meeting_title"]
            const meeting_Host = result[0]["meeting_host"]
            const date_scheduled = result[0]["date_scheduled_for"]
    
        // Send the redirection URL as a response to the client if the user has an account
        if(firstname){
            
            return res.json({ redirectUrl:redirectUrl, firstname:firstName, lastname:lastName, profile_picture:profilePicture, account_type:accountType, buffer:userIdMain, meetingTitle:meetingTitle, meetingHost:meeting_Host, date_scheduled:date_scheduled});
        }else{
            return res.json({ redirectUrl:redirectUrl, profile_picture:profilePicture, account_type:accountType, buffer:userIdMain, meetingTitle:meetingTitle, meetingHost:meeting_Host, date_scheduled:date_scheduled});
        }
    
            }else{
                console.log("No Record Found")
            }
        }) 
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
 
module.exports = JoinRoom