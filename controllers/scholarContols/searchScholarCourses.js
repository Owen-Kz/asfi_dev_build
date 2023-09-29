const db = require("../../routes/db.config");

const SearchScholarCourses = (req,res) =>{
    if(req.user){
        const username = req.user.username
        const searchQuery = req.params.searchQuery
        const  AllCourse = []
        const itemsPerPage = 5;  // Number of items to display per page
        const currentPage = req.query.page || 1;  // Current page, default is 1
        const sortBy = req.query.sortBy

        const startIndex = (currentPage - 1) * itemsPerPage;
        db.query("SELECT COUNT(*) AS all_scholar_courses FROM applied_courses WHERE participants_username =?", [username], (err, course_count) =>{
          if(err) throw err
          const TotalCourcesByscholar = course_count[0]["all_scholar_courses"]
    
        db.query("SELECT * FROM applied_courses WHERE LOWER(course_name) COLLATE utf8mb4_general_ci LIKE LOWER(?) AND participants_username =? ORDER BY id DESC", [`%${searchQuery}%`, username], (err,data)=>{
            if(err) throw err                
                if (data && data.length > 0) {
                    var pendingQueries = data.length;
                    data.forEach(courseItem => {
                        const courseID = courseItem.course_id;
                        const CourseTitle = courseItem.course_name;
                        const CourseStatus = courseItem.course_progress;
            
                      db.query("SELECT COUNT(*) AS tutorials_to_course FROM tutorials WHERE related_course_id = ?", [courseID], (err, tutorialFound) => {
                        if (err) {
                          console.error("Error:", err);
                          return;
                        }
            
                        const tutorialToCourseCount = tutorialFound[0]["tutorials_to_course"];
            
                        db.query("SELECT COUNT(*) AS scholars_completed FROM applied_courses WHERE course_id = ? AND course_progress = 'completed'", [courseID], (err, completed) => {
                          if (err) {
                            console.error("Error:", err);
                            return;
                          }
            
                          const completedCount = completed[0]["scholars_completed"];
            
                          db.query("SELECT COUNT(*) AS scholars_enrolled FROM applied_courses WHERE course_id = ? AND course_progress = 'in Progress'", [courseID], (err, enrolled) => {
                            if (err) {
                              console.error("Error:", err);
                              return;
                            }
                          const enrolledCount = enrolled[0]["scholars_enrolled"];
            
                          
            
                         

                            AllCourse.push({
                                course_id: courseID,
                                course_title: CourseTitle,
                                course_progress: CourseStatus,        
                                tutorials_count: tutorialToCourseCount,
                        
                            });
            
                          if (--pendingQueries === 0) {
                          const totalPages = Math.ceil(TotalCourcesByscholar / itemsPerPage);
                          
            
                            res.json({MyCoursesList : JSON.stringify(AllCourse), totalPages: totalPages, currentPage:currentPage})
                          }
                        });
                      })
                      });
                    });
                  } else {
                    res.json({MyCoursesList : JSON.stringify(AllCourse)});
                  }
        })
    })
    }else{
        res.json("Unathorized")
    }

}
module.exports = SearchScholarCourses