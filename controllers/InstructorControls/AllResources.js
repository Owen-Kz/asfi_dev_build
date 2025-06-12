const db = require("../../routes/db.config");
const dbPromise = require("../../routes/dbPromise.config");
const findPublications = require("../feed/findASFIRJPublications");

const AllResources = async (req, res) => {
    const itemsPerPage = 5; // Number of items to display per page
    const page = req.query.page || 1; // Current page, default is 1
    let username
    if (req.query.username){
        username = req.query.username
    }else if(req.user){
        username = req.user.username
    }else{
        username = ""
    }
    const getUserFullname = await dbPromise.query("SELECT first_name, email, last_name FROM user_info WHERE username = ? OR unique_code = ?", [username, username])
    if(getUserFullname[0].length <1){
        return res.json({error:"Could not find user",  queryArray:[], currentPage:0, totalPages:0})
    }
    const fullname = `${getUserFullname[0][0].first_name} ${getUserFullname[0][0].last_name}`
   

    const ASFIRJ_Publications = await findPublications(fullname)
    
    // if (req.user) {
        // const username = req.user.username;
        const DataArray = [];
        let completedQueries = 0;
        const totalQueries = 4; // Total number of queries to run

        // Add ASFIRJ publications to DataArray
        if (ASFIRJ_Publications && ASFIRJ_Publications.length > 0) {
            ASFIRJ_Publications.forEach(publication => {
                DataArray.push({
                    title: publication.manuscript_full_title,
                    itemID: publication.buffer || publication.doi,
                    itemType: "publication",
                    Status: "Published",
                    co_authors: publication.co_authors,
                    journal: "ASFIRJ",
                    year: publication.data_published,
                    url: publication.buffer
                });
            });
        }

        const FindResource = (tableName, validator, value) => {
            return new Promise((resolve, reject) => {
                if (value !== "") {
                    db.query(`SELECT * FROM ${tableName} WHERE ${validator} = ? `, [value], (err, dataItem) => {
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
                                            Status: newdata.link_title,
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
            await FindResource("podcasts", "podcast_owner", username);
            await FindResource("tutorials", "tutorial_owner", username);
            await FindResource("books", "book_author", username);
            await FindResource("external_links", "link_owner", username);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    // }
};

module.exports = AllResources;