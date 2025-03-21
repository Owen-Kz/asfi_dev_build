const fetchSpaceData = async (spaceId) => {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT * FROM spaces WHERE space_id = ?",
            [spaceId],
            async (err, data) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(data[0]);
                }
            }
        );
    });
}

module.exports = fetchSpaceData;