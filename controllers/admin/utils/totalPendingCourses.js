const db = require("../../../routes/db.config");

const TotalPendingCourses = async (req,res)=>{
    db.query("SELECT COUNT(*) AS total_pending_courses_count FROM asfi_courses WHERE course_status = 'applied'", (err,data)=>{
        if(err) throw err
        res.json({status:"success", PendingCoursesCount:data[0]["total_pending_courses_count"]})
    })
}

module.exports = TotalPendingCourses