const db = require("../../../routes/db.config");


const TotalPendingResources = async (req,res) =>{
    db.query("SELECT COUNT(*) AS books_count FROM books WHERE status = 'applied'", async(err,data)=>{
        if(err) throw err
        const TotalBooksCount = new Number(data[0]["books_count"])
        db.query("SELECT COUNT(*) AS tutorials_count FROM tutorials WHERE status = 'applied'", async(err, tutorialsCount) =>{
            if(err) throw err
            const TotalTutorialsCount = new Number(tutorialsCount[0]["tutorials_count"])
            db.query("SELECT COUNT(*) AS total_podcasts_count FROM podcasts WHERE status = 'applied'", async(err, podcastCount)=>{
                if(err) throw err
                const TotalPodcastsCount = new Number(podcastCount[0]["total_podcasts_count"])
                db.query("SELECT COUNT(*) AS total_links_count FROM external_links WHERE status = 'applied'", async (err,linksCount)=>{
                    if(err) throw err
                    const TotalLinksCount = new Number(linksCount[0]["total_links_count"])

                    const TotalCount = Math.floor(TotalBooksCount + TotalTutorialsCount + TotalPodcastsCount + TotalLinksCount)
            
                    res.json({TotalPendingResources:TotalCount})
                })
            })
        })
    })
}

module.exports = TotalPendingResources