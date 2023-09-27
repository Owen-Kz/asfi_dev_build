const db = require("../../routes/db.config");

const TotalStudentsCount = (req,res) =>{
    if(req.user){
        const username = req.user.username
    db.query("SELECT COUNT(*) AS scholars_students FROM applied_courses WHERE course_progress = 'in Progress' AND course_instructor_username =?",[username], (err, students) => {
        if (err) {
          console.error("Error:", err);
          return;
        }
        const studentsCount = students[0]["scholars_students"];
        if(studentsCount > 0){
            res.json({TotalStudents: studentsCount})
        }else{
            res.json({TotalStudents:0})
        }
    })
}
}

module.exports = TotalStudentsCount