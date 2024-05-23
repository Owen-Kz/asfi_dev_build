const db = require("../../../routes/db.config");

const DeleteCourses = async (req,res)=>{

    const {course_id} = req.body

    db.query("SELECT *  FROM asfi_courses WHERE course_id = ?",[course_id], async (err, data) =>{
        if(err) throw err
        if(data[0]){
            db.query("DELETE FROM asfi_courses WHERE course_id =? AND course_status = 'rejected'", [course_id], async (err, Deleted)=>{
                if(err){
                    console.log(err)
                    res.json({status:"error", message: "An error occured please try again"})
                }
                else{
               res.json({status:"success", message:"Course Deleted successfully"})
                }
            })
        }
    })
}

module.exports = DeleteCourses