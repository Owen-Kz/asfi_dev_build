const { config } = require("dotenv")

const findPublications = async (userEmail) =>{
  
    try{
        
            const response = await fetch(`${process.env.ASFIRJ_DOMAIN}/external/findAuthorPublications.php?author=${userEmail}`, {
                method: "GET"
            })
            const responseData = await response.json()
            const ArticleList = responseData.articlesList
         
          
            if(ArticleList.length > 0){
                return ArticleList
            }else{
              return  []
            }
            
 
    }catch(error){
        console.log(error)
        return []
    }
}


module.exports = findPublications