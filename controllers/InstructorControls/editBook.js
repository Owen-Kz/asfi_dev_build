const db = require("../../routes/db.config");

const editbook = (req,res) =>{

    if(req.user){
    const username = req.user.username
    const {bookId, bookTitleEdit, bookYearEdit} = req.body
   

    db.query("SELECT * FROM books WHERE book_id =? AND book_author =?", [bookId, username], async (err,data) =>{
        if(err) throw err
        if(data){
            db.query("UPDATE books SET ? WHERE book_id =?", [{book_title:bookTitleEdit, book_year: bookYearEdit},bookId], (err, update)=>{
                if(err) throw err
                if(update){
                    res.render("successful", {status:"Book Updated Succesfully", page:"/myAssets"})
                }
            })
        }else{
            res.render("error", {status:"Data does not Exist"})
        }
    })

    }
}

module.exports = editbook