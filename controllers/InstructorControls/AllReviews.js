const db = require("../../routes/db.config");

const AllReviews = async (req, res) => {
    const itemsPerPage = 5; // Number of items to display per page
    const page = req.query.page || 1; // Current page, default is 1

    if (req.user) {
        const username = req.user.username;
        const DataArray = [];
        let completedQueries = 0;
        const totalQueries = 1; // Total number of queries to run

        const FindResource = (tableName, validator, value) => {
            return new Promise((resolve, reject) => {
                if (value !== "") {
                    db.query(`SELECT * FROM ${tableName} WHERE ${validator} = ? `, [value], (err, dataItem) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (dataItem) {
                                dataItem.forEach(newdata => {
                                        DataArray.push({
                                            course_name: newdata.course_name,
                                            review_content: newdata.review_content,
                                            review_rating:newdata.review_rating, 
                                            reviewer_name: newdata.reviewer_name,
                                            reviewer_username: newdata.reviewer_username,
                                            review_id: newdata.review_id,
                                            course_id: newdata.course_id,
                                            course_owner_username: newdata.course_owner_username,
                                        });
                                });
                            }
                            completedQueries++;
                            if (completedQueries === totalQueries) {
                                
                                const totalItems = DataArray.length;
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

                                const itemsForCurrentPage = DataArray.slice(startMain, endMain);

                                res.json({
                                    queryArray: JSON.stringify(itemsForCurrentPage),
                                    totalPages: totalPages,
                                    currentPage: page
                                });

                            }

                            resolve();
                        }
                    });
                // } 

                    resolve();
                }
            });
        };

        try {
            await FindResource("course_reviews", "course_owner_username", username);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
};

module.exports = AllReviews;
