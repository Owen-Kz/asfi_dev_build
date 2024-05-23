const db = require("../../../routes/db.config");

const AdminResourcesMain = async (req, res) =>{
    const itemsPerPage = 5; // Number of items to display per page
    const page = req.query.page || 1; // Current page, default is 1

    if (req.query) {
         const DataArray = [];
        let completedQueries = 0;
        const totalQueries = 4; // Total number of queries to run

        const FindResource = (tableName) => {
            return new Promise((resolve, reject) => {
                if (tableName != "") {
                    db.query(`SELECT * FROM ${tableName} WHERE 1`, (err, dataItem) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (dataItem) {
                                dataItem.forEach(newdata => {
                                    if (tableName === "podcasts") {
                                        DataArray.push({
                                            title: newdata.podcast_title,
                                            itemID: newdata.buffer,
                                            itemType: "podcast",
                                            Status: newdata.status,
                                            File:newdata.fileID,
                                            Owner:newdata.podcast_owner
                                        });
                                    } else if (tableName === "tutorials") {
                                        DataArray.push({
                                            title: newdata.tutorial_title,
                                            itemID: newdata.tutorial_id,
                                            itemType: "tutorial",
                                            Status: newdata.status,
                                            File:newdata.tutorial_video,
                                            Owner: newdata.tutorial_owner                                          

                                        });
                                    } else if (tableName === "external_links") {
                                        DataArray.push({
                                            title: newdata.link_href,
                                            itemID: newdata.link_buffer,
                                            itemType: "link",
                                            Status: newdata.status,
                                            File:"N/A",
                                            Owner: newdata.link_owner
                                        });
                                    } else if (tableName === "books") {
                                        DataArray.push({
                                            title: newdata.book_title,
                                            itemID: newdata.book_id,
                                            itemType: "book",
                                            Status: newdata.status,
                                            File:newdata.file,
                                            Owner:newdata.book_author
                                        });
                                    }
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
            await FindResource("podcasts");
            await FindResource("tutorials");
            await FindResource("books");
            await FindResource("external_links");
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
};

module.exports = AdminResourcesMain;
