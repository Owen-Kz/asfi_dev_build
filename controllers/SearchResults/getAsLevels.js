const db = require("../../routes/db.config");
// let tutorial_ARRAY = [];
let OwnerFullname 
let OwnerProfilePicture
let CourseName
let CourseLevel

const getAsLevels = async (req, res) => {
    const Level = req.params.level
    let LevelQuery

    if(Level != "All levels"){
        LevelQuery = {course_level:Level}
    }else{
        LevelQuery = 1
    }
    let MAIN_TUTORIALS_ARRAY = []

        db.query("SELECT * FROM asfi_courses WHERE ?", [LevelQuery], async (err, data) => {
            if (err) {
                console.log(err);
                return res.json({ message: "Error occurred while querying the database" });
            }
            
            if (data.length > 0) {
                // Use Promise.all to wait for all owner data queries to finish
                const ownerDataPromises = data.map(async (tutorialData) => {
                    const course_id = tutorialData.course_id

                    const TutorialsData = await getTutorialsInfo(course_id)
                    const LecturesCount = await getLecturesCount(course_id)

                
                    if(tutorialData){
                    CourseName = tutorialData.course_name
                    CourseLevel = tutorialData.course_level
                    CourseCount = LecturesCount.length
                    }else{
                        CourseName = ""
                        CourseLevel = ""
                       CourseCount = ""

                    }
                    MAIN_TUTORIALS_ARRAY = []

               
                        TutorialsData.map(async (tutorialMainTop) => {
                    MAIN_TUTORIALS_ARRAY.push({
                        tutorial_title: tutorialMainTop.tutorial_title,
                        tutorial_id: tutorialMainTop.tutorial_id,
                        related_course_id: tutorialMainTop.related_course_id,
                        tutorial_owner: tutorialMainTop.tutorial_owner,
                        video_duration: tutorialMainTop.video_duration,
                        tutorial_description: tutorialMainTop.tutorial_description,
                        tutorial_thumbnail: tutorialMainTop.tutorial_thumbnail,
                        OwnerFullname: tutorialMainTop.OwnerFullname,
                        category: tutorialMainTop.category,
                        CourseName: CourseName,
                        CourseLevel: CourseLevel,
                        OwnerProfilePicture: tutorialMainTop.OwnerProfilePicture,
                        date_uploaded: tutorialMainTop.date_uploaded,
                        CourseCount: CourseCount

                    })
                })          
            });

                // Wait for all owner data queries to complete
                const ownerDataArray = await Promise.all(ownerDataPromises);
                const tutorialsWithOwners = MAIN_TUTORIALS_ARRAY;
                res.json({ message: "Success", AsLevelArray: JSON.stringify(tutorialsWithOwners) });
            } else {
                res.json({ message: "No data Match your search",  AsLevelArray:"[]"});
            }
        });
  
}


let tutorialData_main
function getTutorialsInfo(course_id) {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM tutorials WHERE related_course_id = ?", [course_id], async (err, tutorials_data) => {
            if (err) {
                reject(err);
            } else {
                tutorialData_main = [];
                const tutorialPromises = tutorials_data.map(async (tutorialsMain) => {
                    const username = tutorialsMain.tutorial_owner;
                    
                    try {
                        const ownerData = await getUserInfo(username);
                        ownerData.forEach(userData =>{
                            const Fullname = `${userData.first_name} ${userData.last_name}`
            
                       
                        tutorialData_main.push({
                            tutorial_id: tutorialsMain.tutorial_id,
                            tutorial_title: tutorialsMain.tutorial_title,
                            tutorial_thumbnail: tutorialsMain.tutorial_thumbnail,
                            tutorial_course: tutorialsMain.related_course_id,
                            category: tutorialsMain.category,
                            related_course_id: tutorialsMain.related_course_id,
                            tutorial_owner: tutorialsMain.tutorial_owner,
                            tutorial_description: tutorialsMain.tutorial_description,
                            video_duration: tutorialsMain.video_duration,
                            date_uploaded: tutorialsMain.date_uploaded,
                            OwnerFullname:Fullname,
                            OwnerProfilePicture:userData.profile_picture
                        });
                    })

                   
                       
                    } catch (error) {
                        reject(error);
                    }
                });
                Promise.all(tutorialPromises)
                    .then(() => resolve(tutorialData_main))
                    .catch((error) => reject(error));

            }
        });
    });
}



// Function to get user info
function getUserInfo(username) {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM user_info WHERE username = ?", [username], (err, owner_data) => {
            if (err) {
                reject(err);
            } else {
                resolve(owner_data);
            }
        });
    });
}


function getLecturesCount(course_id) {
    return new Promise((resolve, reject) => {
        db.query("SELECT id FROM tutorials WHERE related_course_id = ?", [course_id], (err, lectures_count) => {
            if (err) {
                reject(err);
            } else {
                resolve(lectures_count);
            }
        });
    });
}


module.exports = getAsLevels;
