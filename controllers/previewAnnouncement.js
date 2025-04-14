const db = require("../routes/db.config")

const previewAnnouncement = async (req, res) =>{
    try{
        if(req.user){
            if(req.query.q){
                const title = req.query.q
                db.query("SELECT * FROM announcements WHERE title = ?",[title], (err, data) =>{
                    if(err){
                        console.log(err)
                        return res.json({error:"No data found"})
                    }
                    if(data[0]){
                        const title = data[0].title 
                        const timestamp  = data[0].timestamp 
                        const content = data[0].data
                    return  res.render("previewAnnouncement", {title, timestamp, content,success:"data", status:"loggedIn", UserName:req.user.username, accountType:req.user.acct_type, FirstName:req.user.first_name, LastName: req.user.last_name, ProfileImage: req.user.profile_picture, Email:req.user.email, UserFirstname:req.user.first_name, UserLastName:req.user.last_name, Course:"Course", CourseYear:"CourseYer", username:req.user.username, Username:req.user.username, UserName:req.user.username})
                        
                    }else{
                    return  res.render("previewAnnouncement", {error:"No data"})

                    }
                })
            }
        }else{
            res.render("loginExternal")
        }
    }catch(error){
        console.log(error)
        return res.json({error:error.message})
    }
}


module.exports = previewAnnouncement