const db = require("../../routes/db.config");

const MyCoursesList = async (req, res) => {
  if (req.user) {
    const username = req.user.username;
    const itemsPerPage = 5;  // Number of items to display per page
    const currentPage = req.query.page || 1;  // Current page, default is 1
    const sortBy = req.query.sortBy

    if(sortBy){
      sortByStatus()
    }else{
    const startIndex = (currentPage - 1) * itemsPerPage;
    const AllCourse = [];
    db.query("SELECT COUNT(*) AS all_user_courses FROM applied_courses WHERE participants_username =?", [username], (err, course_count) =>{
      if(err) throw err
      const TotalCourcesByuser = course_count[0]["all_user_courses"]

    db.query("SELECT * FROM applied_courses WHERE participants_username = ? ORDER BY id  DESC LIMIT ? OFFSET ?",
    [username, itemsPerPage, startIndex], (err, data) => {
      if (err) {
        console.error("Error:", err);
        return;
      }

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

       


              AllCourse.push({
                course_id: courseID,
                course_title: CourseTitle,
                course_progress: CourseStatus,        
                tutorials_count: tutorialToCourseCount,
           
              });

              if (--pendingQueries === 0) {
              const totalPages = Math.ceil(TotalCourcesByuser / itemsPerPage);
                res.json({MyCoursesList : JSON.stringify(AllCourse), totalPages: totalPages, currentPage:currentPage})
              }
        
          });
        });
      } else {
        res.json({MyCoursesList : JSON.stringify(AllCourse), totalPages: 0, currentPage:0, });
      }
    });
  })
}

function sortByStatus(){
  const startIndex = (currentPage - 1) * itemsPerPage;
  const AllCourse = [];
  db.query("SELECT COUNT(*) AS all_user_courses FROM applied_courses WHERE participants_username =? AND course_progress =?", [username, sortBy], (err, course_count) =>{
    if(err) throw err
    const TotalCourcesByuser = course_count[0]["all_user_courses"]

  db.query("SELECT * FROM applied_courses WHERE participants_username = ? AND course_progress =? ORDER BY id  DESC LIMIT ? OFFSET ?",
  [username, sortBy, itemsPerPage, startIndex], (err, data) => {
    if (err) {
      console.error("Error:", err);
      return;
    }

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

        //   db.query("SELECT COUNT(*) AS scholars_completed FROM applied_courses WHERE course_id = ? AND course_progress = 'completed'", [courseID], (err, completed) => {
        //     if (err) {
        //       console.error("Error:", err);
        //       return;
        //     }

        //     const completedCount = completed[0]["scholars_completed"];

            // db.query("SELECT COUNT(*) AS scholars_enrolled FROM applied_courses WHERE course_id = ? AND course_progress = 'in Progress'", [courseID], (err, enrolled) => {
            //   if (err) {
            //     console.error("Error:", err);
            //     return;
            //   }
            // const enrolledCount = enrolled[0]["scholars_enrolled"];

            

            AllCourse.push({
              course_id: courseID,
              course_title: CourseTitle,
              tutorials_count: tutorialToCourseCount,
              course_progress: CourseStatus,

            });

            if (--pendingQueries === 0) {
            const totalPages = Math.ceil(TotalCourcesByuser / itemsPerPage);
            

              res.json({MyCoursesList : JSON.stringify(AllCourse), totalPages: totalPages, currentPage:currentPage, course_progress: sortBy})
            }
          });
        // })
        // });
      });
    } else {
      res.json({MyCoursesList : JSON.stringify(AllCourse), totalPages: 0, currentPage:0, });
    }
  });
})
}
  }
};

module.exports = MyCoursesList;
