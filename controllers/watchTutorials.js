const db = require("../routes/db.config");
const bcrypt = require("bcryptjs");
const formatDate = require("./utils/formatDate");
const getTutorialOwner = require("./utils/FindTutorialOwner");

const watchTutorials = async (req, res) => {
    try {
        if (req.user) {
            if (req.params["courseID"] && req.params["tutorialID"]) {
                const TutorialOwner = req.params["tutorialOwner"]
                const SearchCourseID = req.params["courseID"];
                const SearchTutorialID = req.params["tutorialID"];

        
                    db.query("SELECT * FROM tutorials WHERE related_course_id = ? AND tutorial_id = ?", [SearchCourseID,SearchTutorialID], (err, result) => {
                        if (err) throw err;                        
                if (result[0]) {
                    const tutorialID = result[0]["tutorial_id"];
                    const tutorialTitle = result[0]["tutorial_title"];
                    const tutorialFile = result[0]["tutorial_video"];
                    const tutorialThumbnail = result[0]["tutorial_thumbnail"];
                    const tutorialCourse = result[0]["related_course_id"];
                    const tutorialDescription = result[0]["tutorial_description"];
                    const tutorialCategory = result[0]["category"];
                    const tutorial_owner = result[0]["tutorial_owner"];
                    const tutorialDate = formatDate(result[0]["date_uploaded"]);

                    const TutorialOfSameCategory = [];
                    const TutorialsOfSameCourse = [];
                    const TutorialBySameAuthor = [];
                    const AllTutorials = [];

                        db.query("SELECT * FROM user_info WHERE username=?", [tutorial_owner], (err, result) => {
                            if (err) return reject(err);             

                        const ownerFirstname = result[0]["first_name"];
                        const ownerLastname = result[0]["last_name"];
                        const owenrProfilePicture = result[0]["profile_picture"];
                                
                       
                    

                        res.render("video_interface", {
                            root: "./public/tutorials/Videointerface",
                            tutorialsInSameCategory: JSON.stringify(TutorialOfSameCategory),
                            tutorialsByAuthor: JSON.stringify(TutorialBySameAuthor),
                            TutorialsOfSameCourse: "[]",
                            mainTitle: tutorialTitle,
                            mainFile: tutorialFile,
                            mainDescription: tutorialDescription,
                            mainId: tutorialID,
                            mainThumbnail: tutorialThumbnail,
                            mainDate: tutorialDate,
                            tutorialOwnerName: TutorialOwner,
                            tutorialCategory_value: SearchCourseID
                        });
                    });
            
                
                } else {
                    res.render("error", { status: "File not Found on Server", page: "/tutorials" });
                }
            })
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = watchTutorials;
