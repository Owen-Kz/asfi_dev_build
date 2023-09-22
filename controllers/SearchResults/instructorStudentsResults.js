const db = require("../../routes/db.config");

const instructorStudentsResults = (req, res) => {
  const itemsPerPage = 10; // Number of items to display per page
  const page = req.query.page || 1; // Current page, default is 1
console.log(req.query)
  if (req.user) {
    const username = req.user.username;

    db.query("SELECT COUNT(*) AS totalItems FROM applied_courses WHERE course_instructor_username =?", [username], (err, countData) => {
      if (err) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        const totalItems = countData[0].totalItems;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        db.query("SELECT * FROM applied_courses WHERE course_instructor_username =? LIMIT ? OFFSET ?", [username, itemsPerPage, (page - 1) * itemsPerPage], (err, data) => {
          if (err) {
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            if (data.length > 0) {
              res.json({ All_insttructorStudents: JSON.stringify(data), totalPages:totalPages, currentPage: page });
            } else {
              res.json({ All_insttructorStudents: "[]", totalPages:totalPages, currentPage: page });
            }
          }
        });
      }
    });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = instructorStudentsResults;
