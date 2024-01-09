const db = require("../../../routes/db.config");

const RejectCourses = async (req,res)=>{

    const {course_id} = req.body

    db.query("SELECT *  FROM asfi_courses WHERE course_id = ?",[course_id], async (err, data) =>{
        if(err) throw err
        if(data[0]){
            db.query("UPDATE asfi_courses SET course_status = 'rejected' WHERE course_id =?", [course_id], async (err, Rejectd)=>{
                if(err){
                    console.log(err)
                    res.json({status:"error", message: "An error occured please try again"})
                }
                else{
               res.json({status:"success", message:"Course Rejected successfully"})
                }
            })
        }
    })
}

module.exports = RejectCourses