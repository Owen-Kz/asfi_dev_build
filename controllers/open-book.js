const db = require("../routes/db.config");
const pdfjs = require('pdfjs-dist');
const fs = require('fs');

const book = async (req, res) => {
  const bookID_SEARCH = req.params["bookID"];
  if (req.user) {
    username_new = req.user.username;
    if (username_new) {
      db.query("SELECT COUNT(*) AS sumBooks FROM books WHERE 1", async (err, bookCount) => {
        if (err) throw err;
        var TOTAL_BOOKS = JSON.stringify(bookCount[0]["sumBooks"]);

        db.query("SELECT * FROM books WHERE book_id = ?", [bookID_SEARCH], async (err, book) => {
          if (err) throw err;
          if(book[0]){
          // Extract relevant fields from the book data
          const bookTitle = book[0]["book_title"];
          const bookAuthor = "book_author";
          const bookYear = "book_year";
          const bookId = "book_id";
          const bookCover = "book_cover";
          const bookFile = "file";
          const bookQsf = book;
          const BOOK_FILE = book[0]["file"];

          // Read the PDF file and extract the page data
          const pdfPath = `./public/userUpload/books/${BOOK_FILE}`; // Provide the path to your PDF file
          const data = fs.readFileSync(pdfPath);
          const dataArrayBuffer = new Uint8Array(data).buffer; // Convert Buffer to Uint8Array
          const pdf = await pdfjs.getDocument(dataArrayBuffer).promise;
          const totalPages = pdf.numPages;
          const pagesData = [];
          const pageNUMBR = []
          const prevPageARRAY = [];
          const nextPageArray = []

        //   EXTRACT DATA FROM CURRENT PAGE 

        // Select and render the next page for every book 
          if(req.query["page"]){
            var NEW_PAGE = parseInt(req.query["page"])

            const page = await pdf.getPage(NEW_PAGE);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item) => item.str).join(' ');

            pagesData.push(pageText);
            pageNUMBR.push(NEW_PAGE)

            prevPage = NEW_PAGE - 1
            NextPage = NEW_PAGE + 1
            
            prevPageARRAY.push(prevPage)
            nextPageArray.push(NextPage)

          }
          else{
            // Extract data from each page: Do this if there is no query for a new page
          for (let pageNum = 1; pageNum <= 1; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item) => item.str).join(' ');
            pagesData.push(pageText);
            pageNUMBR.push(pageNum)

            prevPage = pageNum - 1
            NextPage = pageNum + 1

            prevPageARRAY.push(prevPage)
            nextPageArray.push(NextPage)
          }
          }

          res.render('open-book.ejs', {
            root: "./public/",
            status: 'logged',
            bookTitle: bookTitle,
            bookAuthor: bookAuthor,
            bookYear: bookYear,
            bookId: bookId,
            book_ID:bookID_SEARCH,
            TOTAL_BOOKS: TOTAL_BOOKS,
            bookQot: bookQsf,
            booksCover: bookCover,
            booksFile: bookFile,
            pageCount: totalPages,
            pageNumber: pageNUMBR,
            pagesData: pagesData, // Pass the extracted page data to the template
            prevPAGE: prevPageARRAY[0],    
            nextPAGE: nextPageArray[0]
            });
          }else{
            res.redirect("/library")
          }
        });
      });
    }
  }
};

module.exports = book;
