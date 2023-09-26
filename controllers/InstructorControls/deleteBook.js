const db = require("../../routes/db.config");

const Deletebook = (req,res) =>{

    if(req.user){
    const username = req.user.username
  
    const {bookIdDelete} = req.body    
    db.query("SELECT * FROM boks WHERE book_id =? AND book_author =?", [bookIdDelete, username], async (err,data) =>{
        if(err) throw err
        if(data){
            db.query("DELETE FROM boks WHERE book_id =?", [bookIdDelete], (err, update)=>{
                if(err) throw err
                if(update){
                    res.render("successful", {status:"Book Deleted Succesfully", page:"/myAssets"})
                }
            })
        }else{
            res.render("error", {status:"Data does not Exist"})
        }
    })

    }
}

module.exports = Deletebook