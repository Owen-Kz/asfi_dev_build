const db = require("../../routes/db.config");

const CourseCategories = (req,res) =>{
    db.query("SELECT * FROM course_category WHERE 1", async(err,CategoryData)=>{
        if(err) throw err
        if(CategoryData){
            // console.log(CategoryData)
            res.json({CourseCategoryArray:CategoryData})
        }
    })

}


module.exports = CourseCategories