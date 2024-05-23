const db = require("../../routes/db.config");

const getTutorialOwner = (courseOwner, tutorialID) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM tutorials WHERE ? AND tutorial_id != ?", [{ tutorial_owner: courseOwner}, tutorialID], (err, CourseExists) => {
            if (err) {
                reject(err);
            } else {
                // console.log(CourseExists)
                resolve(CourseExists);
            }
        });
    });
};

module.exports = getTutorialOwner