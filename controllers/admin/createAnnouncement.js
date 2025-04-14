const { error } = require("pdf-lib")
const db = require("../../routes/db.config")
const NewAnnouncementNotification = require("../notifications/newAnnoucementNotification")

const CreateAnnouncement = async (req,res) =>{
    try{
        const {title, content} = req.body
        if(!title || !content){
            return res.json({error:"All fields are required"})
        }
        db.query("SELECT * FROM announcements WHERE title = ? AND data = ?", [title, content], async (err, data) =>{
            if(err){
                console.log(err)
                return res.json({error:err})
            }
            else if(data[0]){
                res.json({error:"A post already exists with this item"})
            }else{
                db.query("INSERT INTO announcements SET ?",[{title, data:content, admin_id:req.admin.id}],async (err, created) =>{
                    if(err){
                        return res.json({error:err})
                    }else{
                        // sendAnnoucment to subscribed users and email
                        const message = title 
                        const endpoint = `https://asfischolar.org/announcement?q=${title}`

                        await NewAnnouncementNotification(req, res, message, endpoint)

                        res.json({success:"Post uploaded Succesfully"})

                    }
                    
                })
            }
        })
    }catch(error){
        console.log(error)
        return res.json({error:error.message})
    }
}


module.exports = CreateAnnouncement