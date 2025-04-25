
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
          [ITEMS_PER_PAGE_BOOKS, offsetBooks], async (err, bookResult) => {
            if (err) {
              console.error(err);
              res.json({error:err, message:err})

              // return res.status(500).send("Internal Server Error");
            }
            const books = bookResult;

            const getBook = async (filename) =>{
              return new Promise((resolve, reject) =>{
                db.query("SELECT filedata FROM files WHERE filename = ?",[filename], (err, data) =>{
                  if(err){
                    console.log(err)
                    resolve("")
                  }else if(data[0]){
                    resolve(data[0].filedata)
                  }else{
                    resolve("")
                  }
                })
              })
            }
            const bookData = await Promise.all(
              books.map(async (book) => {
                const bookFile = await getBook(book.file);
            
                return {
                  book_title: book.book_title,
                  book_id: book.book_id,
                  book_cover: book.book_cover,
                  book_owner_username: book.book_owner_username,
                  book_author: book.book_author,
                  datePublished: book.datePublished,
                  book_year: book.book_year,
                  date_uploaded: book.date_uploaded,
                  file: bookFile
                };
              })
            );
            if(books){
                res.json({
                    status:"success",
                    books: JSON.stringify(bookData),
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