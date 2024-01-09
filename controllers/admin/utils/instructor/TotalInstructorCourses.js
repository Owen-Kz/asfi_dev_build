const db = require("../../../../routes/db.config");

const TotalInstructorCourses = async (req,res)=>{
    const username = req.params.username

    db.query("SELECT COUNT(*) AS total_Instructor_courses_count FROM asfi_courses WHERE course_instructor =?",[username], (err,data)=>{
        if(err) throw err
        res.json({status:"success", TotalCourses:data[0]["total_Instructor_courses_count"]})
    })
}

module.exports = TotalInstructorCourses