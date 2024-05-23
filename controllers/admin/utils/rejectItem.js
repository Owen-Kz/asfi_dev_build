const db = require("../../../routes/db.config");


const RejectItem = (req,res) =>{
    const ItemType = req.params.ItemType
    const ItemID = req.query.ItemID


    function RejectSingleItem(TableName, validator, ItemID){

        db.query(`SELECT * FROM ${TableName} WHERE ${validator} =?`, [ItemID], async (err,data)=>{
            if(err) throw err
            if(data[0]){
                db.query(`UPDATE ${TableName} SET status = 'rejected' WHERE ${validator} =?`, [ItemID], async (err, Rejectd) =>{
                    if(err) throw err
                    if(Rejectd){
                    res.json({status:"success", message:"Item Rejected Successfully"})
                    }else{
                        res.json({status:"error", message:"Internal Server Error"})
                    }
                })
            }
        })
    } 

    if(ItemType == "podcast"){
        RejectSingleItem("podcasts", "buffer", ItemID)
    }else if(ItemType == "tutorial"){
        RejectSingleItem("tutorials", "tutorial_id", ItemID)
    }else if(ItemType == "link"){
        RejectSingleItem("external_links", "link_buffer", ItemID)
    }else if(ItemType == "book"){
        RejectSingleItem("books", "book_id", ItemID)
    }
}

module.exports = RejectItem