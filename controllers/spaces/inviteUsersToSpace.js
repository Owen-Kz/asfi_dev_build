const db = require("../../routes/db.config")
const spaceInvitationNotification = require("../notifications/spaceInvitation")
const saveNotification = require("../scholarContols/saveNotification")
const sendEmail = require("../utils/sendEmail")

const inviteUserToSpace = async (req,res) =>{
    try{
        const {space_id, userEmail} = req.body
        const username = req.user.id
   

        db.query("SELECT * FROM spaces WHERE space_admin = ? AND space_id = ?", [username, space_id], async(err, spaceData)=>{  
            if(err){
                return res.json({error:err})
            }else if(spaceData[0]){
                const spaceName = spaceData[0].space_focus
                db.query("SELECT * FROM user_info WHERE email = ? OR username = ?", [userEmail, userEmail], async(err, userData)=>{
                    if(err){
                        console.log(err)
                        return res.json({error:err})
                    }else if(userData[0]){
                        db.query("SELECT * FROM space_invitations WHERE user = ? AND space_id = ?",
                            [userData[0].username, space_id], async(err, data) =>{
                            if(err){
                                console.log(err)
                                return res.json({error:err})
                            }else if(data[0]){
                                return res.json({error:"User Already invited"})

                            }else{
                      
                        db.query("INSERT INTO space_invitations SET ?", [{user:userData[0].username, space_id:space_id, status:"invited"}], async(err, insert)=>{
                            if(err){
                                console.log(err)
                                return res.json({error:err})
                            }else if(insert){

                                if(userData[0].notification_token !== null && userData[0].notification_token){
                                    const userToken = userData[0].notification_token
                                   await spaceInvitationNotification(spaceName, userToken)
                                }
                                const subject = "Invitation to Join Spaace on ASFIScholar"
                                const useremail = userData[0].email
                                const username = userData[0].username
                                const message = `
                                <style>
                      body{
                      box-sizing: border-box;
                      padding: 0;
                      margin:0;
                      }
                      
                      </style>
                      <div class="card"
                      width: 400px;
                      align-items: center;
                      background:white;
                      border-bottom-right-radius: 25px;
                      border-bottom-left-radius: 25px;
                      border:1px solid purple;
                      padding:0px 0px 20px 0px;">
                      <p><div class="logo_container" style="    display:flex;
                      align-items:center;
                      justify-content: center;
                      width:150px;
                      padding:0px 50px;
                      background-color: white;
                      border-bottom-right-radius: 25px;
                      border-bottom-left-radius: 25px;">
                      <img src="https://asfischolar.org/files/images/ASFIScholar_Logo.png" alt="logo" style="width:100%;
                      height:100%;
                      border-radius: inherit;
                      object-fit: cover;">
                      </div>
                      </p>
                      <br>
                      <p><div class="profileImg" style="
                      width:100px;
                      height:100px;
                      border-radius: 50%;
                      overflow: hidden;">
                  
                      </div>
                      </p>
                      <br>
                      <p><div class="text-container" style="   
                      
                      align-items: center;
                      justify-content: center;">
                      <p><div class="name" style="font-weight: bold;">
                     ${spaceData[0].space_focus}</div></p>
                      <p><div>${spaceData[0].space_description}</div></p>
                      <p><div>You have been invited to join this space</div></p>
                      </div>
                      </p>
                      <br>
                      <p><a href="https://asfischolar.org/s/m/spaces/accept/${spaceData[0].space_id}">
                      <button style=" display: flex;
                      padding:10px;
                      background:purple;
                      border:none;
                      outline:none;
                      color:white;
                      border-radius: 25px;">Accept Invite</button>
                      </p>
                   
                      </a>
                         <p><div>If you do not wish to be part of this space, do not click on the accept button</div></p>
                      </div>
                      `;
                      res.json({success:"Invitation sent"})
                      
                                await sendEmail(useremail, subject, message)
                               await saveNotification(req.user.username,userData[0].username,`Invitation to Join ${spaceData[0].space_focus}`, req.user.profile_picture, `https://asfischolar.org/s/m/spaces/accept/${spaceData[0].space_id}`,"no")

                            }
                        })
                    }
                })
                    }else{
                        return res.json({error:"User not found"})
                    }
                })
            }else{
                return res.json({error:"You are not the admin of this space"})
            }
        })
    }catch(error){
        console.log(error)
        return res.json({error:error.message})
    }
}


module.exports = inviteUserToSpace