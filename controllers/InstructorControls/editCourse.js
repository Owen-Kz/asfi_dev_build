const db = require("../../routes/db.config");

const editCourse = (req,res) =>{
    if(req.user){
        const username = req.user.username
        const {courseEditID, courseTitleEdit, courseDescription} = req.body
    
        db.query("SELECT * FROM asfi_courses WHERE course_instructor =? AND course_id =?", [username, courseEditID],async(err, data)=>{
            if(err) throw err
            if(data){
                db.query("UPDATE asfi_courses SET ? WHERE course_id =? AND course_instructor =?",[{course_name:courseTitleEdit, course_description:courseDescription},courseEditID, username], async(err, update)=>{
                    if(err) throw err
                    if(update){
                        res.render("successful", {status:"Course has been updated Succesfully", page:"/instructorCourses"})
                    }else{
                        res.render("error", {status:"An Error Occured While updating the course"})
                    }
                })
            }else{
                res.render("error", {status:"unauthorized Access"})
            }
        } )
    }
}

module.exports = editCourse