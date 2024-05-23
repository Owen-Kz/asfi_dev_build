const db = require("../../../../routes/db.config");
const pendingResources = async (req,res) =>{
    let completedQueries = 0;
    const totalQueries = 5; // Total number of queries to run
    const CountArray = []
    const FindResource = (tableName, countAS, validator, value) => {
        return new Promise((resolve, reject) => {
            if (value !== "") {
                db.query(`SELECT COUNT(*) AS ${countAS} FROM ${tableName} WHERE ${validator} = ? `, [value], (err, dataItem) => {
                    if (err) {
                        reject(err);
                    } else {
                        CountArray.push(dataItem[0][`${countAS}`])
                  
                        completedQueries++;
                        if (completedQueries === totalQueries) {                    
                            res.json({
                                queryArray: JSON.stringify(CountArray),
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
        await FindResource("podcasts", "podcastCount", "status", "applied");
        await FindResource("tutorials","tutorialsCount", "status", "applied");
        await FindResource("books", "booksCount", "status", "applied");
        await FindResource("external_links", "linksCount", "status", "applied");
        await FindResource("asfi_courses", "coursesCount", "course_status", "applied");

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = pendingResources