const db = require("../../routes/db.config");
let tutorial_ARRAY = [];
let OwnerFullname 
let OwnerProfilePicture

const tutorialSearchResults = async (req, res) => {
    if (req.params.q) {
        const ITEMS_PER_PAGE_tutorialS = 6; // Number of tutorials per page
        tutorial_ARRAY = [];

        const visitor = req.user.username;
        const pagetutorials = req.query.page || 1; // Get the current tutorial page from the query parameter
        if (req.query.page) {
            tutorial_ARRAY = []
        }

        

        // Calculate the offset for tutorials
        const offsettutorials = (pagetutorials - 1) * ITEMS_PER_PAGE_tutorialS;

        // Initialize variables to store data
        let userData, tutorials, tutorialCount, totalPagestutorials;

        const SearchParameter = req.params.q




        db.query("SELECT * FROM tutorials WHERE tutorial_title COLLATE utf8mb4_general_ci LIKE ? OR tutorial_owner COLLATE utf8mb4_general_ci LIKE ? OR tutorial_description COLLATE utf8mb4_general_ci LIKE ? AND status = 'live' ORDER BY id DESC", [`%${SearchParameter}%`, `%${SearchParameter}%`, `%${SearchParameter}%`], async (err, data) => {
            if (err) {
                console.log(err);
                return res.json({ message: "Error occurred while querying the database" });
            }
            
            if (data.length > 0) {
                // Use Promise.all to wait for all owner data queries to finish
                const ownerDataPromises = data.map(async (tutorialData) => {
                    const username_OWNER = tutorialData.tutorial_owner;
                    const tutorialCourseId = tutorialData.related_course_id;
                    const ownerData = await getUserInfo(username_OWNER);

                    const CourseData = await getCoursesInfo(tutorialCourseId)
                    const CountRelatedCourse = await countCourses(tutorialCourseId)
                    
                    OwnerFullname = ownerData.first_name +" "+ ownerData.last_name;
                    OwnerProfilePicture = ownerData.profile_picture;
                    if(CourseData){
                        CourseName = CourseData.course_name
                        CourseLevel = CourseData.course_level
                        CourseCount = CountRelatedCourse.length
                        }else{
                            CourseName = ""
                            CourseLevel = ""
                           CourseCount = ""
    
                        }

                    return {
                        TutorialTitle: tutorialData.tutorial_title,
                        TutorialId: tutorialData.tutorial_id,
                        courseID: tutorialData.related_course_id,
                        TutorialOwner: tutorialData.tutorial_owner,
                        TutorialDuration: tutorialData.video_duration,
                        TutorialDescription: tutorialData.tutorial_description,
                        TutoriaThumbnail: tutorialData.tutorial_thumbnail,
                        TutorialOwnerFullName: OwnerFullname,
                        CourseLevel: CourseLevel,
                        CourseCount: CourseCount,
                        TutorialOwnerProfilePicture: OwnerProfilePicture,
                        TutorialDate: tutorialData.date_uploaded,
                        TotalRelatedTutorials: tutorialData.category
                    };
                });

                // Wait for all owner data queries to complete
                const tutorialsWithOwners = await Promise.all(ownerDataPromises);

                res.json({ message: "Success", tutorialS_ARRAY_JSON: JSON.stringify(tutorialsWithOwners) });
            } else {
                res.json({ message: "No data Match your search" });
            }
        });
    } else {
        res.redirect("/library");
    }
}

// Function to get user info
function getUserInfo(username) {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM user_info WHERE username = ?", [username], (err, owner_data) => {
            if (err) {
                reject(err);
            } else {
                resolve(owner_data[0]);
            }
        });
    });
}

function getCoursesInfo(course_id) {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM asfi_courses WHERE course_id = ? AND course_status = 'live'", [course_id], (err, course_data) => {
            if (err) {
                reject(err);
            } else {
                resolve(course_data[0]);
            }
        });
    });
}

function countCourses(course_id) {
    return new Promise((resolve, reject) => {
        db.query("SELECT id FROM tutorials WHERE related_course_id = ? AND status = 'live'", [course_id], (err, course_count) => {
            if (err) {
                reject(err);
            } else {
                resolve(course_count);
            }
        });
    });
}

module.exports = tutorialSearchResults;
