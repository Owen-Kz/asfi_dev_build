const db = require("../routes/db.config");



// Initialize variables to store data
let userData, totalPages, totalTutorialsCount;

const displayCoursesOnly = async (req, res) => {
    if (req.user) {
        const  ITEMS_PER_PAGE_tutorials = 5
// Get the current book page from the query parameter
let pagetutorials = req.query.pageBook || 1; 
const offsettutorials = (pagetutorials - 1) * ITEMS_PER_PAGE_tutorials;

        const username_new = req.user.username;
        const userData = []
        if (username_new) {
            db.query("SELECT * FROM user_info WHERE username = ?",[username_new],async(err,user)=>{
                if(err) throw err
                if(user[0]){
                    const accountType = user[0]["acct_type"]
                    const FirstName = user[0]["first_name"]
                    const lastName = user[0]["last_name"]
                    const profile_picture = user[0]["profile_pciture"]

                    userData.push({
                        FirstName: FirstName,
                        accountType: accountType,
                        lastName: lastName,
                        profile_picture: profile_picture
                    })
                }
            })
            const AllTutorials = [];

            // GET ALL Tutorials
            db.query("SELECT * FROM tutorials WHERE related_course_id != 'rtuT3g' AND status = 'live'", async (err, result) => {
                if (err) throw err;
                var tutorialsCount = result.length

                totalTutorialsCount = Math.ceil(tutorialsCount / ITEMS_PER_PAGE_tutorials);

                const promises = result.map(async (tutorial) => {
                    const tutorialTitle = tutorial.tutorial_title;
                    const tutorialID = tutorial.tutorial_id;
                    const courseID = tutorial.related_course_id;
                    const TutorialOwner = tutorial.tutorial_owner;
                    const TutorialDescription = tutorial.tutorial_description;
                    const TutorialDuration = tutorial.video_duration;
                    const TutoriaThumbnail = tutorial.tutorial_thumbnail;
                    const TutorialDate = tutorial.date_uploaded
                    const course = await queryAsync("SELECT * FROM asfi_courses WHERE course_id = ? AND course_status = 'live'", [
                        courseID,
                    ]);

                    const tutorialsCount = await queryAsync("SELECT COUNT(*) AS relatedCoursesCount FROM tutorials WHERE related_course_id = ? AND related_course_id != 'rtuT3g' AND status = 'live'", [
                        courseID,
                    ]);

                    const coursesMain = []
                    if ((tutorialsCount[0]["relatedCoursesCount"] > 0)) {
                        if(course[0]){
                        const CourseName = course[0].course_name
                        const CourseLevel = course[0].course_level

                        coursesMain.push(
                            {CourseName: CourseName,
                            CourseLevel: CourseLevel
                        })

                        }else{
                            const CourseName = "N/A"
                            const CourseLevel = "N/A"

                            coursesMain.push(
                                {CourseName: CourseName,
                                CourseLevel: CourseLevel
                            })
                        }


                        const CourseTutorialCount = tutorialsCount[0]["relatedCoursesCount"]
                        const tutorialOwner = await queryAsync("SELECT * FROM user_info WHERE username = ?", [
                            TutorialOwner,
                        ]);

                        if (tutorialOwner[0]) {
                            const TutorialOwnerFirstName = tutorialOwner[0].first_name
                            const TutorialOwenerLastname = tutorialOwner[0].last_name
                            const TutorialProfilePicture = tutorialOwner[0].profile_picture

                            const OwenrFullName = TutorialOwnerFirstName + " " + TutorialOwenerLastname;

                            AllTutorials.push({
                                TutorialTitle: tutorialTitle,
                                TutorialId: tutorialID,
                                courseID: courseID,
                                TutorialOwner: TutorialOwner,
                                TutorialDuration: TutorialDuration,
                                TutorialDescription: TutorialDescription,
                                TutoriaThumbnail: TutoriaThumbnail,
                                TutorialOwnerFullName: OwenrFullName,
                                TutorialOwnerProfilePicture: TutorialProfilePicture,
                                CourseLevel: coursesMain[0].CourseLevel,
                                CourseName: coursesMain[0].CourseName,
                                TutorialDate:TutorialDate,
                                TotalRelatedTutorials: CourseTutorialCount
                            });
                        }
                    }
                });

                await Promise.all(promises);

                if (AllTutorials.length > 0) {
          
                    res.render("tutorials", {
                        status: "logged",
                        user: username_new,
                        accountType: userData[0].accountType,
                        FirstName: userData[0].FirstName,
                        LastName:userData[0].lastName,
                        UserName: username_new,
                        AllTutorials: JSON.stringify(AllTutorials),
                    });
                }else{
                    res.render("tutorials", {
                        status: "logged",
                        user: username_new,
                        accountType: userData[0].accountType,
                        FirstName: userData[0].FirstName,
                        LastName:userData[0].lastName,
                        UserName: username_new,
                        AllTutorials: "[]",
                    });
                }
            });
        }
    }
};

module.exports = displayCoursesOnly;

// Helper function to promisify the database query
function queryAsync(query, values) {
    return new Promise((resolve, reject) => {
        db.query(query, values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
