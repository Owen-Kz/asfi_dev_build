const db = require("../../routes/db.config")

const getUserInfo = async (req,res) =>{
    try{
        const userName = req.params.username 
  
        db.query("SELECT prefix, username, first_name, last_name, acct_type, profile_picture FROM user_info WHERE username = ?", [userName], async(err, data) =>{
            if(err){
                throw err
            }else if(data[0]){
                res.json({success:"User Info", user:data[0]})
            }else{
                const dummyData = [{
                    first_name: "Deleted",
                    last_name: "Account",
                    username: "deleted_account",
                    profile_picture: "https://res.cloudinary.com/dll8awuig/image/upload/v1705444097/dc69h8mggh01bvlvbowh.jpg",
                    id:"001490841"
                }]
           
                return res.json({success:"User Info", user:dummyData[0]})
            }
        })
    }catch(error){
        console.log(error)
        return res.json({error:error.message})
    }
}

module.exports = getUserInfo