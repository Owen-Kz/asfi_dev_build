const db = require("../../../../routes/db.config");


const TotalInstructorStudents = async (req,res)=>{
    const username = req.params.username
    db.query("SELECT COUNT(*) AS total_Instructor_courses_count FROM applied_courses WHERE course_instructor_username =?",[username], (err,data)=>{
        if(err) throw err
        res.json({status:"success", TotalStudents:data[0]["total_Instructor_courses_count"]})
    })
}

module.exports = TotalInstructorStudents