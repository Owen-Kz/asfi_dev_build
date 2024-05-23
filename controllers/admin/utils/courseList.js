const db = require("../../../routes/db.config");

let totalPages, totalCoursesCount;

const courseList = async(req,res) => {
    const Page = req.query.page
    const searchQuery = req.query.q
    const Filter = req.query.filter

    const  ITEMS_PER_PAGE_Courses = 6
    let pageCourses = req.query.page || 1; 
    const offsetCourses = (pageCourses - 1) * ITEMS_PER_PAGE_Courses; 

    let TotalSCourses
    db.query("SELECT COUNT(*) as Total_count FROM asfi_courses WHERE 1", async(err, data)=>{
        if(err) throw err
    TotalSCourses = data[0]["Total_count"]
    })
// Function to send REsponse to the client 
function SendResponse(dataArray){
    var CoursesCount = dataArray.length
        
    totalCoursesCount = CoursesCount;
    totalPages = Math.ceil(TotalSCourses / ITEMS_PER_PAGE_Courses);

    res.json({status:"success",
    courses_list: JSON.stringify(dataArray), 
    currentPageCourses:pageCourses,
    totalPagesCourses: totalPages,
    totalCourses: totalCoursesCount
})
}

   if(!searchQuery && !Filter){
    db.query("SELECT * FROM asfi_courses WHERE 1 ORDER BY id DESC LIMIT ? OFFSET ? ",
    [ITEMS_PER_PAGE_Courses, offsetCourses], async (err,data)=>{
        if(err) throw err
        SendResponse(data)
    })
    }

    if(searchQuery){
        db.query("SELECT * FROM asfi_courses WHERE LOWER(course_description) COLLATE utf8mb4_general_ci LIKE LOWER(?) OR LOWER(course_name) COLLATE utf8mb4_general_ci LIKE LOWER(?) OR LOWER(course_instructor) COLLATE utf8mb4_general_ci LIKE LOWER(?) ORDER BY id DESC", [`%${searchQuery}%`, `%${searchQuery}%`,  `%${searchQuery}%`], async(err,searchResult)=>{
            if(err) throw err 
            SendResponse(searchResult)
        })
    }

    if(Filter){
        db.query("SELECT * FROM asfi_courses WHERE course_status =? ORDER BY id DESC", [Filter], async(err,filterResult)=>{
            if(err) throw err
            SendResponse(filterResult)
        })
        
    }

}

module.exports = courseList