const db = require("../../../routes/db.config");


const UserInfo =  async (req,res) =>{
    const UsernameQuery = req.params.username

    if(UsernameQuery){
    db.query("SELECT * FROM user_info WHERE username =?", [UsernameQuery], async(err,data)=>{
        if(err) throw err
        res.json({status:"success", UserInfo:JSON.stringify(data)})
    })
}else{
    console.log("Username is not set")
}
}


module.exports = UserInfo