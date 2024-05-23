const db = require("../../../routes/db.config");

const DeleteItem = (req,res) =>{
    const ItemType = req.params.ItemType
    const ItemID = req.query.ItemID

    function DeleteSingleItem(TableName, validator, ItemID){
        db.query(`SELECT * FROM ${TableName} WHERE ${validator} =?`, [ItemID], async (err,data)=>{
            if(err) throw err
            if(data[0]){
                db.query(`DELETE FROM ${TableName} WHERE ${validator} =?`, [ItemID], async (err, Deleted) =>{
                    if(err) throw err
                    if(Deleted){
                    res.json({status:"success", message:"Item Deleted Successfully"})
                    }else{
                        res.json({status:"error", message:"Internal Server Error"})
                    }
                })
            }
        })
    } 

    if(ItemType == "podcast"){
        DeleteSingleItem("podcasts", "buffer", ItemID)
    }else if(ItemType == "tutorial"){
        DeleteSingleItem("tutorials", "tutorial_id", ItemID)
    }else if(ItemType == "link"){
        DeleteSingleItem("external_links", "link_buffer", ItemID)
    }else if(ItemType == "book"){
        DeleteSingleItem("books", "book_id", ItemID)
    }
}

module.exports = DeleteItem