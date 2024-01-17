const db = require("../../../routes/db.config");


const SearchResources_admin = async (req, res) => {
    const itemsPerPage = 5; // Number of items to display per page
    const page = req.query.page || 1; // Current page, default is 1

    if (req.query) {
        // const username = req.user.username;
        const searchQuery = req.params.searchQuery

        const DataArray = [];
        let completedQueries = 0;
        const totalQueries = 4; // Total number of queries to run

        const SearchResourcesFunction = (tableName, validator, columnName, searchQuery, value) => {
            return new Promise((resolve, reject) => {
                if (value !== "") {
                    db.query(`SELECT * FROM ${tableName} WHERE LOWER(${columnName}) COLLATE utf8mb4_general_ci LIKE LOWER(?) `, [`%${searchQuery}%`], (err, dataItem) => {
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
                                            Owner:newdata.tutorial_owner
                                        });
                                    } else if (tableName === "external_links") {
                                        DataArray.push({
                                            title: newdata.link_href,
                                            itemID: newdata.link_buffer,
                                            itemType: "link",
                                            Status: newdata.link_title,
                                            File:"N/A",
                                            Owner:newdata.link_owner
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
            await SearchResourcesFunction("podcasts", "podcast_owner", "podcast_title", searchQuery, "username");
            await SearchResourcesFunction("tutorials", "tutorial_owner", "tutorial_title", searchQuery, "username");
            await SearchResourcesFunction("books", "book_author", "book_title", searchQuery, "username");
            await SearchResourcesFunction("external_links", "link_owner", "link_href",searchQuery, "username");
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error", ErroMsg:error });
        }
    }
};

module.exports = SearchResources_admin;
