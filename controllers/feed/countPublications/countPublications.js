const dbPromise = require("../../../routes/dbPromise.config");
const ASFIRJ_PUBLICATIONS = require("./countASFIRPublications");

const countPublications = async (username) =>{
    try{

        const getUserInfo = await dbPromise.query("SELECT * FROM user_info WHERE username = ? OR unique_code = ?", [username, username]);
        if(!getUserInfo[0][0]){
            console.log("User Not Found")
            return {error:"User Not Found"}
        }
        
        const mainUsername = getUserInfo[0][0].username
        const firstname = getUserInfo[0][0].first_name
        const lastname = getUserInfo[0][0].last_name



        const [bookCountResult] = await dbPromise.query("SELECT COUNT(*) AS bookCount FROM books WHERE book_author = ?", [mainUsername]);
        const [linkCountResult] = await dbPromise.query("SELECT COUNT(*) AS linksCount FROM external_links WHERE link_owner = ?", [mainUsername]);
        const [podcastCountResult] = await dbPromise.query("SELECT COUNT(*) AS podcastCount FROM podcasts WHERE podcast_owner = ?", [mainUsername]);
        const [tutorialCountResult] = await dbPromise.query("SELECT COUNT(*) AS tutorialCount FROM tutorials WHERE tutorial_owner = ?", [mainUsername]);
        const BooksCountMain = bookCountResult[0].bookCount;
        const LinksCount = linkCountResult[0].linksCount;
        const BooksCount = BooksCountMain + LinksCount;
        
        const PodcastCount = podcastCountResult[0].podcastCount ;
        const TutorialCount = tutorialCountResult[0].tutorialCount;
        const ASFIRJPublications = await ASFIRJ_PUBLICATIONS(firstname, lastname)
        
        const totalPublications = BooksCount + PodcastCount + TutorialCount + ASFIRJPublications

        return totalPublications
    }catch(error){
        console.log(error)
        return {error:error.message, totalPublications: 0}
    }
}


module.exports = countPublications