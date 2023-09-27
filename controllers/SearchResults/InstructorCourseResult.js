const db = require("../../routes/db.config");

const instructorCourseResult = async (req, res) => {
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
    db.query("SELECT COUNT(*) AS all_instructor_courses FROM asfi_courses WHERE course_instructor =?", [username], (err, course_count) =>{
      if(err) throw err
      const TotalCourcesByInstructor = course_count[0]["all_instructor_courses"]

    db.query("SELECT * FROM asfi_courses WHERE course_instructor = ? ORDER BY id  DESC LIMIT ? OFFSET ?",
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
          const courseDecription = courseItem.course_description;
          const CourseCategory = courseItem.category;
          const CourseStatus = courseItem.course_status;

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
                course_description: courseDecription,
                course_category: CourseCategory,
                course_status: CourseStatus,
                completed_count: completedCount,
                tutorials_count: tutorialToCourseCount,
                enrolled_count: enrolledCount
              });

              if (--pendingQueries === 0) {
              const totalPages = Math.ceil(TotalCourcesByInstructor / itemsPerPage);
                res.json({All_InstructorCourses : JSON.stringify(AllCourse), totalPages: totalPages, currentPage:currentPage})
              }
            });
          })
          });
        });
      } else {
        res.json({All_InstructorCourses : JSON.stringify(AllCourse), totalPages: 0, currentPage:0, });
      }
    });
  })
}

function sortByStatus(){
  const startIndex = (currentPage - 1) * itemsPerPage;
  const AllCourse = [];
  db.query("SELECT COUNT(*) AS all_instructor_courses FROM asfi_courses WHERE course_instructor =? AND course_status =?", [username, sortBy], (err, course_count) =>{
    if(err) throw err
    const TotalCourcesByInstructor = course_count[0]["all_instructor_courses"]

  db.query("SELECT * FROM asfi_courses WHERE course_instructor = ? AND course_status =? ORDER BY id  DESC LIMIT ? OFFSET ?",
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
        const courseDecription = courseItem.course_description;
        const CourseCategory = courseItem.category;
        const CourseStatus = courseItem.course_status;

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
              course_description: courseDecription,
              course_category: CourseCategory,
              course_status: CourseStatus,
              completed_count: completedCount,
              tutorials_count: tutorialToCourseCount,
              enrolled_count: enrolledCount
            });

            if (--pendingQueries === 0) {
            const totalPages = Math.ceil(TotalCourcesByInstructor / itemsPerPage);
            

              res.json({All_InstructorCourses : JSON.stringify(AllCourse), totalPages: totalPages, currentPage:currentPage, course_status: sortBy})
            }
          });
        })
        });
      });
    } else {
      res.json({All_InstructorCourses : JSON.stringify(AllCourse), totalPages: 0, currentPage:0, });
    }
  });
})
}
  }
};

module.exports = instructorCourseResult;
