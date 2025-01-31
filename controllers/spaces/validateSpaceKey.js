const db = require("../../routes/db.config")

const validateSpaceKey = async (req, res, next) => {
    try {
        const { spaceKey, space_id } = req.body
        if (!spaceKey) {
            return res.json({ error: "Space Key is required" })
        } else {
            db.query("SELECT * FROM spaces WHERE space_passkey =? AND space_id =?", [{ spaceKey, space_id }], async (err, spaceData) => {
                if (err) throw err
                if (spaceData[0]) {
                    db.query("SELECT * FROM space_participants WHERE username =? AND space_id =?", [username, space_id], async (err, DataInSpace) => {
                        if (err) throw err
                        if (DataInSpace[0]) {
                            console.log("Data Exists")
                        } else {

                            console.log("Space is Public")

                            db.query("INSERT INTO space_participants SET ?", [{ username: username, space_id: space_id }], async (err, insert) => {
                                if (err) throw err
                                if (insert) {
                                    console.log("Joined Space")
                                }
                            })
                        }
                    })
                    return res.json({ success: "Valid Space Key provided" })

                } else {
                    return res.json({ error: "Invalid Space Key" })
                }
            })

        }
    } catch (error) {
        console.log(error)
        return res.json({ error: error.message })
    }
}


module.exports = validateSpaceKey