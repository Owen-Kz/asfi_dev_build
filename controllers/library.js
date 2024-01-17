const db = require("../routes/db.config");
const fetchWebsiteData = require("./utils/getLinkPreview");

const ITEMS_PER_PAGE_BOOKS = 6; // Number of books per page
const ITEMS_PER_PAGE_LINKS = 3; // Number of links per page

const library = async (req, res) => {

if(req.user){
  const username_new = req.user.username;
  let pageBooks = req.query.pageBook || 1; // Get the current book page from the query parameter
  let pageLinks = req.query.pageLink || 1; // Get the current link page from the query parameter

  // Calculate the offset for both books and links
  const offsetBooks = (pageBooks - 1) * ITEMS_PER_PAGE_BOOKS;
  const offsetLinks = (pageLinks - 1) * ITEMS_PER_PAGE_LINKS;

  // Initialize variables to store data
  let userData, bookCount, books, externalLinks, totalPages, totalLinksCount;
  const BOOK_DATA_ARRAY = [];

  // Function to render the EJS page with available data
  const renderLibraryPage = async (allDataLink) => {
    res.render("library.ejs", {
      root: "./public",
      status: "logged",
      BOOK_DATA_ARRAY: JSON.stringify(books),
      accountType: userData[0]["acct_type"],
      books: JSON.stringify(books),
      externalLinks: JSON.stringify(allDataLink),
      currentPageBooks:pageBooks,
      currentPageLinks: pageLinks,
      totalPagesBooks: totalPages,
      totalLinks: linksCount,
      totalPagesLinks: totalLinksCount
    });
  };

  // Query user_info
  db.query("SELECT * FROM user_info WHERE username = ?", [username_new], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    userData = data;

    // Query book count
    db.query("SELECT COUNT(*) AS sumBooks FROM books WHERE 1", (err, bookCountResult) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }
      bookCount = JSON.stringify(bookCountResult[0]["sumBooks"]);
      db.query("SELECT COUNT(*) AS sumLinks from external_links WHERE 1", (err, totalLinks)=> {
        if (err) {
          console.error(err);
          return res.status(500).send("Internal Server Error: More info: Error Getting Links");
        }
        linksCount = JSON.stringify(totalLinks[0]["sumLinks"])

        totalPages = Math.ceil(bookCount / ITEMS_PER_PAGE_BOOKS);
        totalLinksCount = Math.ceil(linksCount / ITEMS_PER_PAGE_LINKS);


    

      // Query books
      db.query("SELECT * FROM books WHERE 1 LIMIT ? OFFSET ?",
        [ITEMS_PER_PAGE_BOOKS, offsetBooks], (err, bookResult) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
          }
          books = bookResult;

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
              const allDataLink = await fetchWebsiteData(dataLinksArray);
              if(allDataLink){
              renderLibraryPage(allDataLink);
              }else{
                res.render("library.ejs", {
                  root: "./public",
                  status: "logged",
                  BOOK_DATA_ARRAY: JSON.stringify(books),
                  accountType: userData[0]["acct_type"],
                  books: JSON.stringify(books),
                  externalLinks: "[]",
                  currentPageBooks:pageBooks,
                  currentPageLinks: pageLinks,
                  totalPagesBooks: totalPages,
                  totalLinks: linksCount,
                  totalPagesLinks: totalLinksCount
                });
              }
            });
          })
        });
    });
  });
}
};

module.exports = library;
