const db = require("../../routes/db.config");

const totalCourses = (req,res) =>{
    const Username = req.params.username
    db.query("SELECT COUNT(*) as TotalCoursesCount FROM asfi_courses WHERE course_instructor =?",[Username], async(err, data)=>{
        if(err) throw err
        if(data){
            const total_coursesCount = data[0]["TotalCoursesCount"]
              res.json({message:`TotalCourses`, TotalCourses: total_coursesCount})
        }
    })
}

module.exports = totalCourses