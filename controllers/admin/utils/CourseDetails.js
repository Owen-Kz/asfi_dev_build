const db = require("../../../routes/db.config");

const courseDetail = async(req,res)=>{
    const CourseID = req.params.courseId

    if(CourseID){
        db.query("SELECT * FROM asfi_courses WHERE course_id = ?", [CourseID], async (err,data)=>{
            if(err) throw err
            res.json({status:"Success", courseDetail:JSON.stringify(data)})
        })
    }else{
        console.log("An Error Occured: Course ID is not set")
    }
}

module.exports  = courseDetail