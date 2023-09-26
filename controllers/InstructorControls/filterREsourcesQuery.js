const db = require("../../routes/db.config");

const FilterResources = async (req, res) => {
    const itemsPerPage = 5; // Number of items to display per page
    const page = req.query.page || 1; // Current page, default is 1

    if (req.user) {
        const username = req.user.username;
        const searchQuery = req.params.filterQuery

        const DataArray = [];
        let completedQueries = 0;
        const totalQueries = 1; // Total number of queries to run

        const FilterResourcesFunction = (tableName, validator, value) => {
            return new Promise((resolve, reject) => {
                if (value !== "") {
                    db.query(`SELECT * FROM ${tableName} WHERE ${validator} =?`, [value], (err, dataItem) => {
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
                                            Status: "Live",
                                        });
                                    } else if (tableName === "tutorials") {
                                        DataArray.push({
                                            title: newdata.tutorial_title,
                                            itemID: newdata.tutorial_id,
                                            itemType: "tutorial",
                                            Status: "Live",
                                        });
                                    } else if (tableName === "external_links") {
                                        DataArray.push({
                                            title: newdata.link_href,
                                            itemID: newdata.link_buffer,
                                            itemType: "link",
                                            Status: "Live",
                                        });
                                    } else if (tableName === "books") {
                                        DataArray.push({
                                            title: newdata.book_title,
                                            itemID: newdata.book_id,
                                            itemType: "book",
                                            Status: "Live",
                                        });
                                    }
                                });
                            }else{
                                res.json({
                                    queryArray:"[]",
                                    totalPages: totalPages,
                                    currentPage: page,
                                    error: "No data Found"
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
            if(searchQuery == "podcast"){
            await FilterResourcesFunction("podcasts", "podcast_owner", username);
            }
            if(searchQuery == "tutorial"){
            await FilterResourcesFunction("tutorials", "tutorial_owner", username);
            }
            if(searchQuery == "book"){
            await FilterResourcesFunction("books", "book_author", username);
            }
            if(searchQuery == "publication"){
            await FilterResourcesFunction("external_links", "link_owner", username);
            }
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error", ErroMsg:error });
        }
    }
};

module.exports = FilterResources;
