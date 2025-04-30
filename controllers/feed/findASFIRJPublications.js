const { config } = require("dotenv")

const findPublications = async (userEmail) =>{
  
    try{
    
        
            const response = await fetch(`${process.env.ASFIRJ_DOMAIN}/external/findAuthorPublications.php?author=${userEmail}`, {
                method: "GET"
            })
            const responseData = await response.json() || [{articlesList: []}]

            if(!response.ok){
                throw new Error(responseData.message || "Failed to fetch publications")
            }
            if(responseData.articlesList === undefined){
                throw new Error("No articles found")
            }
            if(responseData.articlesList === null){
                throw new Error("No articles found")
            }
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