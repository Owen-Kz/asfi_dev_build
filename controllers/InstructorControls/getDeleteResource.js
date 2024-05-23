const db = require("../../routes/db.config");

const getDeleteResource = (req,res) =>{
    const DeleteData = req.params.deleteData

    const DeleteID = JSON.parse(DeleteData).DeleteID
    const DeleteType = JSON.parse(DeleteData).DeleteType

    const FindFieldData = async (tableName, validator, value, dataType) => {
        if (value !== "") {
            db.query(`SELECT * FROM ${tableName} WHERE ${validator} = ?`, [value], async(err, newdata) => {
                if (err) throw err;
                if (newdata) {  // Check if the response hasn't been sent yet

                    if(dataType == "book"){
                    res.json({ type:"book", queryResult: JSON.stringify(newdata) }); 
                    
                    }else if(dataType == "podcast"){

                    res.json({ type:"podcast", queryResult: JSON.stringify(newdata) });

                    }else if(dataType == "link"){
                        
                    res.json({ type:"publication", queryResult: JSON.stringify(newdata) });

                    }else if(dataType == "tutorial"){
                        
                    res.json({ type:"tutorial", queryResult: JSON.stringify(newdata) });

                    }
                }else{
                    res.json({ type:"N/A", queryResult: "[]" });
                    }
            });
        }
    };


    if(DeleteType == "book"){
        FindFieldData("books", "book_id", DeleteID, DeleteType)
    }

    if(DeleteType == "link"){
        FindFieldData("external_links", "link_buffer", DeleteID, DeleteType)
    }

    if(DeleteType == "podcast"){
        FindFieldData("podcasts", "buffer", DeleteID, DeleteType)
    }

    if(DeleteType == "tutorial"){
        FindFieldData("tutorials", "tutorial_id", DeleteID, DeleteType)
    }
    
}

module.exports = getDeleteResource