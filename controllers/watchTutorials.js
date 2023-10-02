const db = require("../routes/db.config");
const bcrypt = require("bcryptjs");
const formatDate = require("./utils/formatDate");
const getTutorialOwner = require("./utils/FindTutorialOwner");

const watchTutorials = async (req, res) => {
    try {
        if (req.user) {
            const username = req.user.username
            const Fullname = req.user.first_name + " " + req.user.last_name
            const Email = req.user.country_of_residence
            const accountType = req.user.acct_type

            const country_of_residence = req.user.country_of_residence

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

                        if(tutorialCourse == "rtuT3g"){
                        res.render("video_interface", {
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
                            tutorialCategory_value: SearchCourseID,
                            total_participants: "",
                            course_level: "",
                            course_category: "",
                            course_name: ""
                        });
                    }else{
                        db.query("SELECT * FROM applied_courses WHERE participants_username =? AND course_id =?",[username, tutorialCourse], async(err, coureData)=>{
                            if(err) throw err
                            if(coureData[0]){
                                RenderCourse(tutorialCourse)
                            }else{
                                db.query("INSERT INTO applied_courses SET ?", [{course_id:tutorialCourse, participants_username:username, participants_fullname:Fullname, course_instructor_username: tutorial_owner, course_name:tutorialTitle, participants_email:Email, participants_country:country_of_residence,}], async(err, course_data)=>{
                                    if(err) throw err
                                    if(course_data){
                                    RenderCourse(tutorialCourse)  
                                    }                                  
                                })
                            }
                        })
                    }

                    });
            
                   const RenderCourse =  async (tutorialCourse) =>{
                        db.query("SELECT * FROM asfi_courses WHERE course_id =?", [tutorialCourse],async (err, data)=>{
                            if(err) throw err
                            if(data[0]){
                                const course_name = data[0].course_name
                                const course_level = data[0].course_level
                                const course_category = data[0].category
                               
                
                                db.query("SELECT COUNT(*) AS total_course_participants FROM applied_courses WHERE course_id =?",[tutorialCourse], async(err, participantsCount)=>{
                                    if(err) throw err 
                                   const TotalParticipants = participantsCount[0]["total_course_participants"]

                                res.render("video_interface", {
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
                                    tutorialCategory_value: SearchCourseID,
                                    total_participants: TotalParticipants,
                                    course_level: course_level,
                                    course_category: course_category,
                                    course_name: course_name
                                });
                            })
                            }
                        })
                        
                    }
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
