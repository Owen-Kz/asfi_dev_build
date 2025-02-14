const { config } = require("dotenv")

const findPublications = async (userEmail) =>{
  
    try{
        console.log(userEmail)
        
            const response = await fetch(`${process.env.ASFIRJ_DOMAIN}/external/findAuthorPublications.php?author=${userEmail}`, {
                method: "GET"
            })
            const responseData = await response.json()
            const ArticleList = responseData.articlesList
            console.log(responseData)
         
          
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