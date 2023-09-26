const db = require("../../routes/db.config");
let PODCAST_ARRAY = []
const podcastSearchResults = async (req, res) => {
    if (req.params.q) {
        
        const ITEMS_PER_PAGE_PODCASTS = 6; // Number of podcasts per page
        let PODCAST_ARRAY = []

        const visitor = req.user.username;
        const pagePodcasts = req.query.page || 1; // Get the current podcast page from the query parameter
        if (req.query.page) {
            PODCAST_ARRAY = []
        }


        // Calculate the offset for podcasts
        const offsetPodcasts = (pagePodcasts - 1) * ITEMS_PER_PAGE_PODCASTS;

        // Initialize variables to store data
        let userData, podcasts, podcastCount, totalPagesPodcasts;

        const SearchParameter = req.params.q


        db.query("SELECT COUNT(*) AS pdtCount FROM podcasts WHERE LOWER(podcast_title) COLLATE utf8mb4_general_ci LIKE LOWER(?) OR LOWER(podcast_owner_fullname) COLLATE utf8mb4_general_ci LIKE LOWER(?) OR LOWER(podcast_owner) COLLATE utf8mb4_general_ci LIKE LOWER(?) ORDER BY id DESC", [`%${SearchParameter}%`, `%${SearchParameter}%`, `%${SearchParameter}%`],
            async (err_PDT, CountPDT) => {
                if (err_PDT) throw err_PDT
                var PodcastCount = JSON.stringify(CountPDT[0]["pdtCount"]);
                totalPagesPodcasts = Math.ceil(PodcastCount / ITEMS_PER_PAGE_PODCASTS);
        

                  db.query("SELECT * FROM podcasts WHERE LOWER(podcast_title) COLLATE utf8mb4_general_ci LIKE LOWER(?) OR LOWER(podcast_owner_fullname) COLLATE utf8mb4_general_ci LIKE LOWER(?) OR LOWER(podcast_owner) COLLATE utf8mb4_general_ci LIKE LOWER(?) ORDER BY id DESC", [`%${SearchParameter}%`, `%${SearchParameter}%`, `%${SearchParameter}%`],(err, data) => {

                    if (err) console.log(err)
                    if (data[[0]]) {
                        data.forEach(podcastData => {
                            PODCAST_ARRAY.push(podcastData)
                        })
                        // console.log(PODCAST_ARRAY)
                        res.json({message:"Success", PODCAST_ARRAY_JSON:JSON.stringify(PODCAST_ARRAY)})
                    }else{
                       res.json({message: "No data Match your search"})
                    //    console.log("Wrong Doings")
                    }
                })
            })
    } else {
        res.redirect("/podcasts")
    }
}

module.exports = podcastSearchResults