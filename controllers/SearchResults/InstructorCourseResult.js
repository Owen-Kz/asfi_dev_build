const db = require("../../routes/db.config");

const instructorCourseResult = async (req, res) => {
  if (req.user) {
    const username = req.user.username;
    const AllCourse = [];

    db.query("SELECT * FROM asfi_courses WHERE course_instructor = ? ORDER BY id DESC", username, (err, data) => {
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

              AllCourse.push({
                course_id: courseID,
                course_title: CourseTitle,
                course_description: courseDecription,
                course_category: CourseCategory,
                coures_status: CourseStatus,
                completed_count: completedCount,
                tutorials_count: tutorialToCourseCount
              });

              if (--pendingQueries === 0) {
                res.json({All_InstructorCourses : JSON.stringify(AllCourse)})
              }
            });
          });
        });
      } else {
        console.log("Pedi", AllCourse);
      }
    });
  }
};

module.exports = instructorCourseResult;
