const db = require("../routes/db.config");

const confrim_code = async (req,res) =>{
    const {code, email} = req.body


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
                res.status(500).json({message: "Internal Server Error"})
            }
        })
    } 
}


module.exports = confrim_code