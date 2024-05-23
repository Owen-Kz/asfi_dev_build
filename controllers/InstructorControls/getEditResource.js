const db = require("../../routes/db.config");

const getEditResource = (req,res) =>{
    const editData = req.params.editData
    const EditID = JSON.parse(editData).EditID
    const EditType = JSON.parse(editData).EditType
    
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


    if(EditType == "book"){
        FindFieldData("books", "book_id", EditID, EditType)
    }

    if(EditType == "link"){
        FindFieldData("external_links", "link_buffer", EditID, EditType)
    }

    if(EditType == "podcast"){
        FindFieldData("podcasts", "buffer", EditID, EditType)
    }

    if(EditType == "tutorial"){
        FindFieldData("tutorials", "tutorial_id", EditID, EditType)
    }
    
}

module.exports = getEditResource