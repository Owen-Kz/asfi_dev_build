const db = require("../../routes/db.config");
let book_ARRAY = []
const bookSearchResults = async (req, res) => {
    if (req.params.q) {
        
        const ITEMS_PER_PAGE_bookS = 6; // Number of books per page
        book_ARRAY = []

        const visitor = req.user.username;
        const pagebooks = req.query.page || 1; // Get the current book page from the query parameter
        if (req.query.page) {
            book_ARRAY = []
        }


        // Calculate the offset for books
        const offsetbooks = (pagebooks - 1) * ITEMS_PER_PAGE_bookS;

        // Initialize variables to store data
        let userData, books, bookCount, totalPagesbooks;

        const SearchParameter = req.params.q


        db.query("SELECT COUNT(*) AS pdtCount FROM books WHERE book_title COLLATE utf8mb4_general_ci LIKE ? OR book_author COLLATE utf8mb4_general_ci LIKE ? OR book_owner_username COLLATE utf8mb4_general_ci LIKE ? ORDER BY id DESC", [`%${SearchParameter}%`, `%${SearchParameter}%`, `%${SearchParameter}%`],
            async (err_PDT, CountPDT) => {
                if (err_PDT) throw err_PDT
                var bookCount = JSON.stringify(CountPDT[0]["pdtCount"]);
                totalPagesbooks = Math.ceil(bookCount / ITEMS_PER_PAGE_bookS);
        

                  db.query("SELECT * FROM books WHERE book_title COLLATE utf8mb4_general_ci LIKE ? OR book_author COLLATE utf8mb4_general_ci LIKE ? OR book_owner_username COLLATE utf8mb4_general_ci LIKE ? ORDER BY id DESC", [`%${SearchParameter}%`, `%${SearchParameter}%`, `%${SearchParameter}%`],(err, data) => {

                    if (err) console.log(err)
                    if (data[[0]]) {
                        data.forEach(bookData => {
                            
                            book_ARRAY.push(bookData)
                        })
                        // console.log(book_ARRAY)
                        res.json({message:"Success", BOOKS_ARRAY_JSON:JSON.stringify(book_ARRAY)})
                    }else{
                       res.json({message: "No data Match your search"})
                    //    console.log("Wrong Doings")
                    }
                })
            })
    } else {
        res.redirect("/library")
    }
}

module.exports = bookSearchResults


