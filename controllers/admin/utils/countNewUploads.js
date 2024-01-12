const db = require("../../../routes/db.config");

const CountNewUploads = async (req, res) => {
    let TotalPodcastRequest, TotalBooksRequest, TotalTutorialsRequest
    var Total = 0
    let QueryCount = 0

    async function FindASum(toSum, tableName, status, variable) {
        db.query(`SELECT * FROM ${tableName} WHERE 1`, async (Err, dataExist) => {
            if (Err) throw Err
            if (dataExist[0]) {

                db.query(`SELECT COUNT(*) AS ${toSum} FROM ${tableName} WHERE status = '${status}'`, async (err, data) => {
                    if (err) throw err
                    if (data[0]) {
                        Total = Math.floor(Total + data[0][`${toSum}`])

                        QueryCount++

                        if (QueryCount == 3) {
                            res.json({uploadCount:Total})
                        }
                    }
                })
            }
        })
    }
    await FindASum("podcastRequest", "podcasts", "applied", TotalPodcastRequest)
    await FindASum('tutorialRequest', "tutorials", "applied", TotalTutorialsRequest)
    await FindASum('bookRequest', 'books', 'applied', TotalBooksRequest)
}

module.exports = CountNewUploads