const db = require("../../routes/db.config");

const acceptSpaceInvitation = async (req, res) => {

    try {
        const { space_id, username, email, unique_code } = req.body
        
    
        const user = username
        if (!username) {
            return res.json({ error: "Username is required" })
        }
        if (!space_id) {
            return res.json({ error: "Space ID is required" })
        } else {
            db.query("SELECT * FROM space_invitations WHERE (user =? OR user = ? OR user = ?) AND space_id =? AND status = 'invited' ", [user, email, unique_code, space_id], async (err, spaceData) => {
                if (err) throw err
                if (spaceData[0]) {
                    db.query("DELETE FROM space_invitations WHERE (user =? OR user = ? OR user = ?) AND space_id =?", [user, email, unique_code, space_id], async (err, deleteData) => {
                        if (err) throw err
                        if (deleteData) {
                            db.query("INSERT INTO space_participants SET ?", [{ username: user, space_id: space_id }], async (err, insert) => {
                                if (err) throw err
                                if (insert) {
                                    return res.json({ success: "User added to the space" })
                                }
                            })
                        }
                    })
                } else {
                    return res.json({ error: "User not in the waiting room" })
                }
            })

        }

    } catch (error) {
        console.log(error)
        return res.json({ error: error.message })
    }
}

module.exports = acceptSpaceInvitation