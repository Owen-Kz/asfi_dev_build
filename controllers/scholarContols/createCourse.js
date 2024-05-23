const multer = require('multer');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg'); // Make sure you have fluent-ffmpeg installed
const db = require('../../routes/db.config');

// Configure Multer for video and thumbnail uploads
const VideoDestination = path.join(__dirname, "../../public/userUpload/videos/");
const ThumbnailDestination = path.join(__dirname, "../../public/userUpload/thumbnails/");

const newVideoNameArray = []
const newThumbnailNameArray = []


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if (file.fieldname === 'video') {
            callback(null, VideoDestination);
            newVideoNameArray.push(VideoDestination)
        } else if (file.fieldname === 'thumbnail') {
            callback(null, ThumbnailDestination);
            newThumbnailNameArray.push(ThumbnailDestination)
        }
    },
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Define the createCourse function
const createCourse = (req, res) => {
    // Handle video and thumbnail uploads
    upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }])(req, res, (uploadError) => {
        if (uploadError) {
            console.error(uploadError);
            return res.status(500).json({ error: 'Error uploading files' });
        }
        // The uploaded files are now available in req.files
        const videoPath = VideoDestination + req.files['video'][0].filename;
        const thumbnailPath = ThumbnailDestination + req.files['thumbnail'][0].filename;

        
        const newVideoName = req.files['video'][0].filename;
        const newThumbnailName = req.files['thumbnail'][0].filename;
        const CourseTitle = req.body.courseTitle
        const CourseID = req.body.buffer
        const CourseDuration = req.body.courseDuration
        const CourseDescription = req.body.shortDescription
        const CourseOwner = req.body.courseOwner
        const CommentId  = req.body.commentBuffer
        const CourseLevel = req.body.courseLevel
        const CourseCost = req.body.courseCost
        const CourseCategory = req.body.category
        const CourseCurrency = req.body.courseCurrency
        const tutorialID = req.body.tutorialBuffer
        
        // Add the course to the database if the file has been uploaded
        db.query("SELECT * FROM asfi_courses WHERE ?", [{course_id:CourseID}], async (err, course) =>{
            if(err) throw err
            if(course[0]){
                res.redirect("/instructorCourses")
            }else{
        db.query("INSERT INTO asfi_courses SET ?", [{course_name:CourseTitle, course_id:CourseID, course_cost_per_session:CourseCost, course_duration: CourseDuration, course_description:CourseDescription, course_instructor:CourseOwner, course_thumbnail: newThumbnailName, course_first_tutorial:newVideoName, comment_id:CommentId, course_currency:CourseCurrency, course_level:CourseLevel, category:CourseCategory}], async (err, created) =>{
            if(err) throw err

        // Process video and thumbnail here
        processVideo(videoPath, thumbnailPath, newVideoName, CourseTitle, tutorialID, newThumbnailName,  CourseID, CourseOwner, CommentId, CourseDescription, CourseCategory, "applied", res);
        db.query("SELECT * FROM course_category WHERE category_title =?", [CourseCategory], (err, courseExists) =>{
            if(err) throw err
            if(courseExists[0]){

            }else{
                db.query("INSERT INTO course_category SET category_title =?",[CourseCategory], (err, newCourse) =>{
                    if(err) throw err
                    if(newCourse){
                        console.log("New Category Created")
                    }else{
                        console.log("Category could not be created")
                    }
                })
            }
        })
        })

            }
        })
      
    });
};

function processVideo(videoPath, thumbnailPath,  newVideoName, CourseTitle, tutorialID, newThumbnailName, CourseID, CourseOwner, CommentId, CourseDescription, CourseCategory,status, res) {
//     // Get video duration using fluent-ffmpeg
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
        if (err) {
            console.error(err);
            res.send('Error processing video.');
        } else {
            const duration = metadata.format.duration; // Video duration in seconds

            // console.log(duration);
            // console.log(metadata);
            db.query("SELECT * FROM tutorials WHERE ?", [{tutorial_id:tutorialID}], async (err, tutorialExists) => {
                if(err) throw err
                if(tutorialExists[0]){
                    // console.log("Turorial Exists")
                    res.redirect("/courses")
                }else{
                    db.query("INSERT INTO tutorials SET ?", [{tutorial_title:CourseTitle, tutorial_id:tutorialID, tutorial_description: CourseDescription, tutorial_owner:CourseOwner, comments_ID:CommentId, related_course_id:CourseID, tutorial_thumbnail:newThumbnailName, tutorial_video:newVideoName, video_duration: duration, category:CourseCategory,
                    status:status
                    }], async (err, tutorialCreated) => {
                        if(err) throw err
                        res.redirect("/instructorCourses")
                    })
                }
            })
   
            // res.render('upload', { duration, thumbnailPath }); 
        }
    });
}

module.exports = createCourse;
