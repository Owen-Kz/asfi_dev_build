const db = require("../../../../routes/db.config");



const AllInstructorCourses = async (req, res) => {
    const itemsPerPage = 5; // Number of items to display per page
    const page = req.query.page || 1; // Current page, default is 1

    if (req.params) {
        const username = req.params.username;

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
                                            title: newdata.pcourse_name,
                                            itemID: newdata.course_id,
                                            Status: newdata.course_status,
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
            await FindResource("asfi_courses", "course_instructor", username);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
};

module.exports = AllInstructorCourses;
