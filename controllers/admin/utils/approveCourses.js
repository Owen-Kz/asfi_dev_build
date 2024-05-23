const db = require("../../../routes/db.config");


const ApproveCourses = async (req,res)=>{

    const {course_id} = req.body

    db.query("SELECT *  FROM asfi_courses WHERE course_id = ?",[course_id], async (err, data) =>{
        if(err) throw err
        if(data[0]){
            db.query("UPDATE asfi_courses SET course_status = 'live' WHERE course_id =?", [course_id], async (err, approved)=>{
                if(err){
                    console.log(err)
                    res.json({status:"error", message: "An error occured please try again"})
                }
                else{
               res.json({status:"success", message:"Course approved successfully"})
                }
            })
        }
    })
}

module.exports = ApproveCourses