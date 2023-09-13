const db = require("../../routes/db.config");

const createScholar = async (req,res) =>{
  const  {
        academic_institution,
        degree,
        degree_subtext,
        scholar_username,
        area_of_interest,
        bio,
      } = req.body


    db.query("SELECT * FROM user_info WHERE username =?",[scholar_username], async(err,data)=>{
      
        if(err) throw err
        if(data[0]){
           
            db.query("UPDATE user_info SET ? WHERE username =?", [{bio:bio, area_of_interest: area_of_interest, highest_level_of_education:academic_institution, acct_type:'scholar_account'}, scholar_username], async (err,updateData)=>{
                
                if(err) throw err
                
                if(updateData){
                  
                    db.query("INSERT INTO honoraries SET ?",{honorary_type:degree, additional_info:degree_subtext, scholar_username:scholar_username}, async(err, honors)=>{
                       if(err) throw err
                        if(honors){
                         res.json({message:"Your Data has been received and will be reviewed by our admins"})
                        }
                    })
                }
            })
        }else{
            res.json({message:"You do not have an account yet"})
        }
    })
}

module.exports = createScholar