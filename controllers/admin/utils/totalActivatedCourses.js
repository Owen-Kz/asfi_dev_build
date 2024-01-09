const db = require("../../../routes/db.config");

const TotalActivatedCourses = async (req,res)=>{
    db.query("SELECT COUNT(*) AS total_Activated_courses_count FROM asfi_courses WHERE course_status = 'live'", (err,data)=>{
        if(err) throw err
        res.json({status:"success", ActivatedCoursesCount:data[0]["total_Activated_courses_count"]})
    })
}

module.exports = TotalActivatedCourses