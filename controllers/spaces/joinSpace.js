const db = require("../../routes/db.config")

const JoinSpace = async (req, res) => {
    try {
        const { space_id } = req.body
        const username = req.user.username

        db.query("SELECT * FROM space_participants WHERE username =? AND space_id =?", [username, space_id], async (err, DataInSpace) => {
            if (err) throw err
            if (DataInSpace[0]) {
                console.log("Data Exists")
            } else {
                // Check if the space is a private space or not
                db.query("SELECT * FROM spaces WHERE space_id =?", [space_id], async (err, spaceData) => {
                    if (err) {
                        console.log(err)
                        return err
                    }
                    if (spaceData[0]) {
                        if (spaceData[0].is_private === "yes") {
                            return res.json({error:"private_space", message: "is_private_space" })
                        } else {
                            console.log("Space is Public")

                            db.query("INSERT INTO space_participants SET ?", [{ username: username, space_id: space_id }], async (err, insert) => {
                                if (err) throw err
                                if (insert) {
                                    console.log("Joined Space")
                                }
                            })
                        }
                    }

                })
            }
        })
    } catch (error) {
        console.log(error)
        return false
    }
}


module.exports = JoinSpace