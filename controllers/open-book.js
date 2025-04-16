const db = require("../routes/db.config");

const book = async (req, res) => {
  const bookID_SEARCH = req.params["bookID"];

  if (req.user) {
    const username_new = req.user.username;

    if (username_new) {
      db.query("SELECT COUNT(*) AS sumBooks FROM books WHERE 1", (err, bookCount) => {
        if (err) throw err;
        const TOTAL_BOOKS = bookCount[0]["sumBooks"];

        db.query("SELECT * FROM books WHERE book_id = ?", [bookID_SEARCH], (err, book) => {
          if (err) throw err;

          if (book.length > 0) {
            const bookTitle = book[0]["book_title"];
            const bookAuthor = book[0]["book_author"];
            const bookYear = book[0]["book_year"];
            const bookId = book[0]["book_id"];
            const bookCover = book[0]["book_cover"];
            const BOOK_FILE = book[0]["file"]; // Filename in the `files` table

            // Fetch the Cloudinary PDF URL
            db.query("SELECT filedata FROM files WHERE filename = ?", [BOOK_FILE], (err, fileData) => {
              if (err) throw err;

              if (fileData.length === 0) {
                return res.json({ error: "File not found in database" });
              }

              const cloudinaryPDFUrl = fileData[0]["filedata"]; // Get Cloudinary URL from database

              // Send Cloudinary URL to the front end
              res.render("open-book.ejs", {
                root: "./public/",
                status: "logged",
                bookTitle: bookTitle,
                bookAuthor: bookAuthor,
                bookYear: bookYear,
                bookId: bookId,
                book_ID: bookID_SEARCH,
                TOTAL_BOOKS: TOTAL_BOOKS,
                booksCover: bookCover,
                booksFile: BOOK_FILE,
                cloudinaryPDFUrl: cloudinaryPDFUrl,
                      logger:"logged", user : username_new, ProfileImage:req.user.profile_picture, UserFirstname:req.user.first_name, UserLastName:req.user.last_name, Course:"Course", CourseYear:"CourseYear", accountType:req.user.acct_type, UserName:username_new, Email:req.user.email, username:username_new, Username:username_new, UserName:username_new
              });
            });
          } else {
            res.redirect("/library");
          }
        });
      });
    }
  }
};

module.exports = book;
