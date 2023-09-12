const db = require("../../routes/db.config");

const AllCourses = async (req,res) =>{
    const courseOwner = req.params.owner
    db.query("SELECT * FROM asfi_courses WHERE course_instructor =?", [courseOwner], async (err, courseData_)=>{
        if(err) throw err
        const CoursesArrayMain = []
            courseData_.forEach(element => {
            
                CoursesArrayMain.push(element)
            });

            res.json({courseData:JSON.stringify(CoursesArrayMain)})
     
    })    
}

module.exports = AllCourses