const { config } = require("dotenv")
const db = require("../../routes/db.config")

const getProfilePublications = async (req,res) =>{
    
    try{
        const {username} = req.params 
        db.query("SELECT * FROM user_info WHERE username = ?", [username], async(err, data) =>{
            if(err){
                return res.json({error:err})
            }
            if(data[0]){
                const firstname = data[0].first_name 
                const lastname = data[0].last_name 

                if(username){
                    const fullname = `${firstname} ${lastname}`
                    const response = await fetch(`${process.env.ASFIRJ_DOMAIN}/external/findAuthorPublications.php?author=${fullname}`, {
                        method: "GET"
                    })
                    const responseData = await response.json()
                    const ArticleList = responseData.articlesList
                    console.log(ArticleList)
                    if(ArticleList.length > 0){
                        return res.json({success:responseData.message, publications:ArticleList})
                    }else{
                      return  res.json({error:responseData.message})
                    }
                    
                }else{
                    return res.json({error:"User Not Logged In"})
                }
            }else{
                return res.json({error:"Not Found"})
            }
        })
       
    }catch(error){
        console.log(error)
        res.json({error:error.message})
    }
}


module.exports = getProfilePublications