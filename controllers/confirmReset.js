const db = require("../routes/db.config");

const confrim_code = async (req,res) =>{
    const {code, email} = req.body
try{

    if(!code || !email){
        return res.json({Status: "Err", Error: "You Did not provide Valid credentials"})
    }else{
        db.query("SELECT * FROM user_info WHERE ? AND ?", [{email:email}, {resetToken:code}], async (err, cnf) => {
          
            if (err) throw err
            if(cnf[0]){
           req.session.tokenData = { confirmCode:code,  confirmEmail: email};
                
                res.status(200).json({message:"EmailConfirmed"})
            }else{
                console.log("Invalid Code")
                res.status(500).json({message: "Reset Code or Email is Invalid"})
            }
        })
    } 
}catch(error){
    console.log(error)
    return res.status(500).json({error:"Something Went wrong", message: "Something went wrong"})
}
}


module.exports = confrim_code