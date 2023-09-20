const db = require("../../routes/db.config");

const SpaceParticipants = async (req, res) => {
    const SpaceIDQuery = req.params.spaceid;

    try {
        const participantsData = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM space_participants WHERE space_id =?", [SpaceIDQuery], (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });

        if (participantsData) {
            const getUserDataPromises = participantsData.map(async (participant) => {
                const participantUsername = participant.username;
                const userData = await new Promise((resolve, reject) => {
                    db.query("SELECT * FROM user_info WHERE username =?", [participantUsername], (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(data);
                        }
                    });
                });
                return userData;
            });

            const participantsUserData = await Promise.all(getUserDataPromises);

            res.json({ message: "Space participants", ParticipantsUserData: JSON.stringify(participantsUserData) });
        } else {
            res.json({ message: "No space participants found", ParticipantsUserData: [] });
        }
    } catch (error) {
        res.status(500).json({ message: "Error occurred while fetching space participants", error: error.message });
    }
};

module.exports = SpaceParticipants;
