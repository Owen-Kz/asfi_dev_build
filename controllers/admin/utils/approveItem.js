const db = require("../../../routes/db.config");


const ApproveItem = (req,res) =>{
    const ItemType = req.params.ItemType
    const ItemID = req.query.ItemID

    function ApproveSingleItem(TableName, validator, ItemID){
        db.query(`SELECT * FROM ${TableName} WHERE ${validator} =?`, [ItemID], async (err,data)=>{
            if(err) throw err
            if(data[0]){
                db.query(`UPDATE ${TableName} SET status = 'live' WHERE ${validator} =?`, [ItemID], async (err, approved) =>{
                    if(err) throw err
                    if(approved){
                    res.json({status:"success", message:"Item Approved Successfully"})
                    }else{
                        res.json({status:"error", message:"Internal Server Error"})
                    }
                })
            }
        })
    } 

    if(ItemType == "podcast"){
        ApproveSingleItem("podcasts", "buffer", ItemID)
    }else if(ItemType == "tutorial"){
        ApproveSingleItem("tutorials", "tutorial_id", ItemID)
    }else if(ItemType == "link"){
        ApproveSingleItem("external_links", "link_buffer", ItemID)
    }else if(ItemType == "book"){
        ApproveSingleItem("books", "book_id", ItemID)
    }
}

module.exports = ApproveItem