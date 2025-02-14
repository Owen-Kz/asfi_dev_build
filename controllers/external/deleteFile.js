const fs = require("fs");
const path = require("path")

const deleteFile = async (req,res) =>{
    try{
    const {file} = req.body 
     const tempDir = path.join(__dirname, "../temp");
     const pdfPath = path.join(tempDir, file);
    if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    return res.json({success:"file deleted"})
    }catch(error){
        res.json({error:error.message})
    }
}


module.exports = deleteFile