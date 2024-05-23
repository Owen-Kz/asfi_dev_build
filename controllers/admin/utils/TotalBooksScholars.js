const db = require("../../../routes/db.config");

const TotalBooks = async (req,res) =>{
    const username = req.params.username

    db.query("SELECT COUNT(*) AS books_count FROM books WHERE book_author =?", [username], async (err,data)=>{
        if(err) throw err
        res.json({TotalBooks:new Number(data[0]["books_count"])})
    })
}


module.exports = TotalBooks