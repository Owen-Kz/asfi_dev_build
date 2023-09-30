const db = require("../routes/db.config");

const createReview = (req,res)=>{
    if(req.user){
        const username = req.user.username
        const userFullname = req.user.first_name +" "+ req.user.last_name
        const {  ratingsCount,
        courseID,
        courseName,
        reviewID,
        course_owner_username,
        reviewText} = req.body

       db.query("SELECT * FROM course_reviews WHERE course_id =? AND reviewer_username =?", [courseID, username], async (err,data)=>{
        if(err) throw err
        if(data[0]){
            res.json({message:"You response has previously been submitted", status:"Exists"})
        }else{
            db.query("INSERT INTO course_reviews SET ?", [{course_name:courseName, course_id:courseID, reviewer_name:userFullname, reviewer_username:username, course_owner_username:course_owner_username, review_id:reviewID, review_content:reviewText, review_rating: ratingsCount}], async (err,insert)=>{
                if(err) throw err
                res.json({message:"Your Review has been received", status:"Success"})
            })
        }
       })
    }
}
module.exports = createReview