const db = require("../routes/db.config");

const ValidateFollower = async (req,res) =>{

    if(req.user){
        const UsernameToValidate = req.params.username
        const UsernameLogged = req.user.username


        db.query("SELECT * FROM followers WHERE followerUsername =? AND followingUSername =?", [ UsernameLogged, UsernameToValidate], async(err, data)=>{
            if(err) throw err
            if(data[0]){
                res.json({message:"following"})
            }else{
                res.json({message: "Not Following"})
            }
        })
    }
}


module.exports = ValidateFollower