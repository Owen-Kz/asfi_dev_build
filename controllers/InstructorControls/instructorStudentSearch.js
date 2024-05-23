const db = require("../../routes/db.config");

const instructorStudentSearch = (req,res) =>{
    if(req.user){
    const username = req.user.username
    const searchNameUser = req.params.searchInput
    

    db.query("SELECT * FROM applied_courses WHERE LOWER(participants_username) COLLATE utf8mb4_general_ci LIKE LOWER(?) OR LOWER(participants_fullname) COLLATE utf8mb4_general_ci LIKE LOWER(?) AND course_instructor_username =? ORDER BY id DESC", [`%${searchNameUser}%`, `%${searchNameUser}%`, username], (err,data)=>{
        if(err) throw err
        if(data[0]){
            res.json({StudentSearchResult: JSON.stringify(data)})
        }else{
            res.json({StudentSearchResult: "[]"})
        }
    })
}else{
    res.json("Unathorized")
}

}

module.exports = instructorStudentSearch