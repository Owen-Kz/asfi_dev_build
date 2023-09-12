const db = require("../routes/db.config");

const createLink = async (req,res) => {
    
    if(req){
        const {
            Facebook,
            Twitter,
            LinkedIn,
            instagram,
            Youtube,
            GoogleScholar,
            ResearchGate,
            WebOfScience,
            scopus,
            Orcid,
            Academia,
            Username
         } = req.body

        // console.log(req.body)
        db.query("SELECT * FROM social_links WHERE link_owner =?", [Username], async(err, data) => {
            if(err) throw err
            if(data[0]){
                db.query("UPDATE social_links SET ? WHERE link_owner =?",[{
                    linked_in:LinkedIn,
                    facebook:Facebook,
                    twitter:Twitter,
                    instagram:instagram,
                    youtube:Youtube,
                    google_scholar:GoogleScholar,
                    research_gate: ResearchGate,
                    web_of_science:WebOfScience,
                    scopus:scopus,
                    orchid:Orcid,
                    academia:Academia
                 }, Username], async(err, update)=>{
                    if(err) throw err
                    res.json({message:"Links Updated"})
                 })
            }else{
                db.query("INSERT INTO social_links SET ?",[{
                    linked_in:LinkedIn,
                    facebook:Facebook,
                    twitter:Twitter,
                    instagram:instagram,
                    youtube:Youtube,
                    google_scholar:GoogleScholar,
                    research_gate: ResearchGate,
                    web_of_science:WebOfScience,
                    scopus:scopus,
                    orchid:Orcid,
                    academia: Academia,
                    link_owner: Username,
                    link_buffer:`ASFPWKRP+${Username}+JASNFBWIR`
                }],(err, insert) => {
                    if(err) throw err
                    res.json({message:"Links Created Succefully"})
                })
            }
        })
    }


}


module.exports = createLink