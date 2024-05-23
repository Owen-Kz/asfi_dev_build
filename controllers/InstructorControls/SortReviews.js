const db = require("../../routes/db.config");

const SortReviews = (req,res) =>{
    if(req.user){
        const itemsPerPage = 5; // Number of items to display per page
        const page = req.query.page || 1; // Current page, default is 1
    
        const username = req.user.username
        const sortQuery = req.query.sortRating
        db.query("SELECT * FROM course_reviews WHERE review_rating = ? AND course_owner_username = ?", [sortQuery, username], async (err,data)=>{
            if(err) throw err
            if(data[0]){
                const totalItems = data.length;
                let endMain
                let startMain
                
                const totalPages = Math.ceil(totalItems / itemsPerPage);
                const startIdx = (page - 1) * itemsPerPage;
                const endIdx = startIdx + itemsPerPage;


                if(endIdx > totalItems){
                    endMain = totalItems
                }else{
                    endMain = endIdx
                }


                if(startIdx > totalItems){
                    startMain = 0
                }else{
                    startMain = startIdx
                }

                const itemsForCurrentPage = data.slice(startMain, endMain);
                res.json({
                    queryArray: JSON.stringify(data),
                    totalPages: totalPages,
                    currentPage: page
                })
            }else{
                res.json({
                    queryArray:"[]",
                    totalPages: 0,
                    currentPage: 1
                })
            }
        })
    }
}

module.exports = SortReviews