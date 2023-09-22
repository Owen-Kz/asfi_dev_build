const db = require("../../routes/db.config");

const totalStudents = (req,res) =>{
    const Username = req.params.username
    db.query("SELECT COUNT(*) as TotalStudentsCount FROM applied_courses WHERE course_instructor_username =?",[Username], async(err, data)=>{
        if(err) throw err
        if(data){
            const total_StudentsCount = data[0]["TotalStudentsCount"]
              res.json({message:`TotalStudents`, TotalStudents: total_StudentsCount})
        }
    })
}

module.exports = totalStudents