const db = require("../../routes/db.config");
// let tutorial_ARRAY = [];
let OwnerFullname 
let OwnerProfilePicture
let CourseName
let CourseLevel

const FilterCoursesInCategory = async (req, res) => {
    const CategoryFilter = req.params.filter
    let CategoryFilterSatement

    if(CategoryFilter != "Generic" && CategoryFilter != "All"){
        CategoryFilterSatement = {category:CategoryFilter}
    }else{
        CategoryFilterSatement = 1
    }

        db.query("SELECT * FROM tutorials WHERE ? AND status = 'live'", [CategoryFilterSatement], async (err, data) => {
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
                        tutorial_title: tutorialData.tutorial_title,
                        tutorial_id: tutorialData.tutorial_id,
                        related_course_id: tutorialData.related_course_id,
                        tutorial_owner: tutorialData.tutorial_owner,
                        video_duration: tutorialData.video_duration,
                        tutorial_description: tutorialData.tutorial_description,
                        tutorial_thumbnail: tutorialData.tutorial_thumbnail,
                        OwnerFullname: OwnerFullname,
                        category: tutorialData.category,
                        CourseName: CourseName,
                        CourseLevel: CourseLevel,
                        OwnerProfilePicture: OwnerProfilePicture,
                        date_uploaded: tutorialData.date_uploaded,
                        CourseCount: CourseCount
                    };
                });

                // Wait for all owner data queries to complete
                const tutorialsWithOwners = await Promise.all(ownerDataPromises);

                res.json({ message: "Success", CourseInCategoryArray: JSON.stringify(tutorialsWithOwners) });
            } else {
                res.json({ message: "No data Match your search",  CourseInCategoryArray:"[]"});
            }
        });
  
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


module.exports = FilterCoursesInCategory;
