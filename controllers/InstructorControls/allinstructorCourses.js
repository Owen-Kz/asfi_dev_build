const db = require("../../routes/db.config");

const AllInstructorCourses = async (req,res) =>{
    db.query("SELECT * FROM asfi_courses WHERE course_instructor = ?", [Username], (err, dataRetrieved) =>{
        if(err) throw err
        if(dataRetrieved){
            res.json({AllInstructorCourses:JSON.stringify(dataRetrieved)})
        }else{
            res.json({AllInstructorCourses:"[]"})

        }
    })
}

module.exports = AllInstructorCourses