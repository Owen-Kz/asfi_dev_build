
    // Query book count

const db = require("../routes/db.config");
const ITEMS_PER_PAGE_BOOKS = 6; // Number of books per page
const GetBooksForLibrary = async (req,res)=>{
    let totalPages, t;

    let pageBooks = req.query.pageBook || 1; // Get the current book page from the query parameter

    const offsetBooks = (pageBooks - 1) * ITEMS_PER_PAGE_BOOKS;

 db.query("SELECT COUNT(*) AS sumBooks FROM books WHERE 1", (err, bookCountResult) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Internal Server Error");
        }
        const bookCount = JSON.stringify(bookCountResult[0]["sumBooks"]);
        totalPages = Math.ceil(bookCount / ITEMS_PER_PAGE_BOOKS);
  
        // Query books
        db.query("SELECT * FROM books WHERE 1 LIMIT ? OFFSET ?",
          [ITEMS_PER_PAGE_BOOKS, offsetBooks], (err, bookResult) => {
            if (err) {
              console.error(err);
              res.json({error:err, message:err})

              // return res.status(500).send("Internal Server Error");
            }
            const books = bookResult;

            if(books){
                res.json({
                    status:"success",
                    BOOK_DATA_ARRAY: JSON.stringify(books),
                    books: JSON.stringify(books),
                    currentPageBooks:pageBooks,
                    totalPagesBooks: totalPages,
                   })
            }else{
                res.json({
                    status:"error",
                    message:"CouldNOtFindBooks",
                    BOOK_DATA_ARRAY: "[]",
                    books: "[]",
                    currentPageBooks:pageBooks,
                    totalPagesBooks: totalPages,
                   })
            }
       
        
            })
      });

}


module.exports = GetBooksForLibrary