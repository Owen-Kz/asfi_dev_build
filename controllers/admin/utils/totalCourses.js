const db = require("../../../routes/db.config");

const TotalCourses = async (req,res)=>{
    db.query("SELECT COUNT(*) AS total_courses_count FROM asfi_courses WHERE 1", (err,data)=>{
        if(err) throw err
        res.json({status:"success", CoursesCount:data[0]["total_courses_count"]})
    })
}

module.exports = TotalCourses