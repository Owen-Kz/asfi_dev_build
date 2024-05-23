const db = require("../routes/db.config");
const fetchWebsiteData = require("./utils/getLinkPreview");
const ITEMS_PER_PAGE_LINKS = 3; // Number of links per page

const getLinksForLibrary = async (req,res) =>{
    let pageLinks = req.query.pageLink || 1; // Get the current link page from the query parameter
  
    // Calculate the offset for both books and links
    const offsetLinks = (pageLinks - 1) * ITEMS_PER_PAGE_LINKS;
  
    // Initialize variables to store data
    let externalLinks,  totalLinksCount;

    db.query("SELECT COUNT(*) AS sumLinks from external_links WHERE 1", (err, totalLinks)=> {
        if (err) {
          console.error(err);
          res.json({error:err, message:err})
          // return res.status(500).send("Internal Server Error: More info: Error Getting Links");
        }
        linksCount = JSON.stringify(totalLinks[0]["sumLinks"])

        totalLinksCount = Math.ceil(linksCount / ITEMS_PER_PAGE_LINKS);
      });


        // Query external links
        db.query("SELECT * FROM external_links WHERE 1 LIMIT ? OFFSET ?",
        [ITEMS_PER_PAGE_LINKS, offsetLinks], async (err, linkResult) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
          }
          externalLinks = linkResult
          const dataLinksArray = []
          
          linkResult.forEach(async (url) => {
            const dataLink = url.link_href
            const linkTitle = url.link_title
            dataLinksArray.push({link:dataLink, title:linkTitle})
          })
          // Find the external link Data 
          const allDataLink = await fetchWebsiteData(dataLinksArray);
          if(allDataLink){
          res.json({
            status:"success",
            externalLinks: JSON.stringify(allDataLink),
            currentPageLinks: pageLinks,
            totalLinks: linksCount,
            totalPagesLinks: totalLinksCount})
          }else{
            res.json({
                status:"error",
                messagE:"Could Not Find Links",
                externalLinks: "[]",
                currentPageLinks: pageLinks,
                totalLinks: linksCount,
                totalPagesLinks: totalLinksCount
            })
          }
        });
}

module.exports = getLinksForLibrary