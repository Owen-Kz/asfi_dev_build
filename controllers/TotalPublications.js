const db = require("../routes/db.config");

const TotalPublications = (req,res) =>{
    if(req.user){
        const username = req.user.username
        let TotalPublications = 0
        let completedQueries = 0;
        const totalQueries = 4;

        function TotalPublicationsFunction(tableName, asCount, ownerValidator, username){
            db.query(`SELECT COUNT(*) AS ${asCount} FROM ${tableName} WHERE ${ownerValidator} =?`, [username], async (err,dataCount) =>{
                if(err) throw err
                TotalPublications = Math.floor(TotalPublications + dataCount[0][asCount])
                completedQueries++;
                if (completedQueries === totalQueries) {
                    res.json({totalPublicationsCount:TotalPublications})
                }

            })
        } 

        TotalPublicationsFunction("books", "totalBooks", "book_author", username)
        TotalPublicationsFunction("tutorials", "totalTutorials", "tutorial_owner", username)
        TotalPublicationsFunction("podcasts", "totalPodcasts", "podcast_owner", username)
        TotalPublicationsFunction("external_links", "totalLinks", "link_owner", username)



    }
}

module.exports = TotalPublications