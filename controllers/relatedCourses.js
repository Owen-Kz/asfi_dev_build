const db = require("../routes/db.config");

const TutorialOfSameCategory = async (req, res) => {
    const owner = req.params.tutorialOwner;
    const tutorialCategory = req.params.tutorialCategory;

    db.query(
        "SELECT * FROM tutorials WHERE related_course_id = ? ORDER BY date_uploaded DESC",
        [tutorialCategory, owner],
        async (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "An error occurred" });
            }

            if (result) {
                const TutorialData = [];

                for (const tutorial of result) {
                    const TutorialOwner = tutorial.tutorial_owner;

                    try {
                        const userData = await getUserData(TutorialOwner);

                        TutorialData.push({
                            tutorial_owner: tutorial.tutorial_owner,
                            tutorial_title: tutorial.tutorial_title,
                            tutorial_description: tutorial.tutorial_description,
                            related_course_id: tutorial.related_course_id,
                            tutorial_id: tutorial.tutorial_id,
                            tutorial_category: tutorial.category,
                            date_uploaded: tutorial.date_uploaded,
                            video_duration: tutorial.video_duration,
                            tutorial_thumbnail: tutorial.tutorial_thumbnail,
                            first_name: userData.first_name,
                            last_name: userData.last_name,
                            profile_picture: userData.profile_picture,
                            username: userData.username
                        });
                    } catch (error) {
                        console.error(error);
                        return res.status(500).json({ message: "An error occurred" });
                    }
                }

                res.json({ TutorialsSameCourseData: JSON.stringify(TutorialData) });
                // console.log(TutorialData)
            }
        }
    );
};

module.exports = TutorialOfSameCategory;

// Function to fetch user data
async function getUserData(username) {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT username, profile_picture, first_name, last_name FROM user_info WHERE username = ?",
            [username],
            (err, userData) => {
                if (err) reject(err);
                if (userData.length > 0) {
                    resolve(userData[0]);
                } else {
                    reject("User data not found");
                }
            }
        );
    });
}
