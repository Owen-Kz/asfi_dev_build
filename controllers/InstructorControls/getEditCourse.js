const db = require("../../routes/db.config");

const getEditCourse = (req, res)=>{
    if(req.user){
        const username = req.user.username
        const editData = req.params.editData
        const EditID = JSON.parse(editData).EditID

        db.query("SELECT * FROM asfi_courses WHERE course_id = ?", [EditID], async (err, newdata) =>{
            if(err) throw err
            if(newdata[0]){
         res.json({QueryResult: JSON.stringify(newdata) });

            }else{
         res.json({QueryResult: "[]" });

            }
        })
        
    }
}

module.exports = getEditCourse

