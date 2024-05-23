const db = require("../../../routes/db.config");

const OpenReviews = async (req,res) => {
    const ReviewId = req.params.reviewId
    
    db.query("SELECT * FROM course_reviews WHERE review_id =?", [ReviewId], async(err, reviewResult)=>{
        if(err) throw err
        res.json({status:"success", course_reviews_item:JSON.stringify(reviewResult)})
    })
}

 
module.exports =  OpenReviews