
const db = require("../../../../routes/db.config");

const CompletedCourses = (req,res) =>{
    db.query("SELECT COUNT(*) AS coursesCount FROM applied_courses WHERE course_progress = 'completed'", async (err,data)=>{
        if(err) throw err
        res.json({coursesCount:data[0]["coursesCount"]})
    })
}

module.exports = CompletedCourses