const { config } = require("dotenv")

const getASFIRJPublications = async (req,res) =>{
    
    try{
        if(req.user){
            const response = await fetch(`${process.env.ASFIRJ_DOMAIN}/external/findAuthorPublications.php?author=${req.user.email}`, {
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
    }catch(error){
        console.log(error)
        res.json({error:error.message})
    }
}


module.exports = getASFIRJPublications