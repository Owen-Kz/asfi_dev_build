const express = require("express");
const LoggedIn = require("../controllers/loggedin")
const find_info = require("../controllers/find_info")
const profile_page = require("../controllers/profile")
const watchTutorials = require("../controllers/watchTutorials");
const library = require("../controllers/library")
const book = require("../controllers/open-book")
const UserPodcast = require("../controllers/UserPodcast")
const Directory = require("../controllers/directory")
const Spaces = require("../controllers/spaces")
const ProfileSettings = require('../controllers/ProfileSettings')
const ProfileUpload = require("../controllers/profileImageUpload")
const DownloadPodcast = require("../controllers/PodcastDownload")
const PlayPodcast = require("../controllers/PlayPodcasts");
const createPodcast = require("../controllers/scholarContols/createPodcast");
const userFollows = require("../controllers/userFollows");
const uploadBooks = require("../controllers/scholarContols/uploadBook");
const BookDownload = require("../controllers/BookDownload");
const dashboard = require("../controllers/dashboard");
const videoConference = require("../controllers/videoConference");

const {v4:uuidv4} = require("uuid");
const PrivateChatRoom = require("../controllers/PrivateChatRoom");
const JoinRoom = require("../controllers/joinRoom");
const render_vc = require("../controllers/render_vc");
const render_main_room = require("../controllers/render_main_room");
const createCourse = require("../controllers/scholarContols/createCourse");
const displayTutorials = require("../controllers/displayTutorials");
const createTutorial = require("../controllers/scholarContols/createTutorial");
const logout = require("../controllers/logout");
const forgotPassword = require("../controllers/forgotPassword");
const renderCourses = require("../controllers/renderCourses");
const profileCoverUpload = require("../controllers/coverImageUpload");
const userCourse = require("../controllers/userCourses");
const deleteAccountPage = require("../controllers/deleteAccount");
const DeleteAccountTrue = require("../controllers/deleteAccountTrue");

const bodyParser = require("body-parser");
const createInstructor = require("../controllers/InstructorControls/createInstructor");
const Assets = require("../controllers/assetes");
const podcastSearchResults = require("../controllers/SearchResults/podcastSearchResults");
const bookSearchResults = require("../controllers/SearchResults/bookSearchResults");
const tutorialSearchResults = require("../controllers/SearchResults/tutorialSearchResults");
const getSpaces = require("../controllers/getSpaces");
const getFollowing = require("../controllers/getfollowing");
const getDiscover = require("../controllers/getDiscover");
const CreateCoursePage = require("../controllers/InstructorControls/createCoursePage");
const displayCoursesOnly = require("../controllers/displayCoursesOnly");
const tutorialsByAuthor = require("../controllers/tutorialsByAuthor");
const TutorialOfSameCategory = require("../controllers/relatedCourses");
const AllCourses = require("../controllers/InstructorControls/allCourses");
const AllCategories = require("../controllers/InstructorControls/allCategories");
const instructorCourses = require("../controllers/InstructorControls/instructorCourses");
const NewNotifications = require("../controllers/SearchResults/newNotifications");
const SpacesChat = require("../controllers/spacesChat");
const becomeScholarPage = require("../controllers/becomeScholar");
const createScholar = require("../controllers/scholarContols/createScholar");
const createSpaces = require("../controllers/createSpaces");
const totalCourses = require("../controllers/SearchResults/totalCourses");
const totalfollowers = require("../controllers/SearchResults/totalFollowing");
const CourseCategories = require("../controllers/SearchResults/CourseCategories");
const FilterCoursesInCategory = require("../controllers/SearchResults/FilterCoursesInCategory");
const getAsTutorial = require("../controllers/SearchResults/getAsTutorials");
const getAsCourses = require("../controllers/SearchResults/getAsCourses");
const getAsLevels = require("../controllers/SearchResults/getAsLevels");
const scholarSearchResults = require("../controllers/SearchResults/scholarSearchResults");
const SpaceParticipants = require("../controllers/SearchResults/spaceParticipants");
const ExitSpace = require("../controllers/SearchResults/exitSpace");
const SpaceChatHistory = require("../controllers/SearchResults/spaceChatHistory");
const getDegree = require("../controllers/SearchResults/getDegreesResult");
const createDegrees = require("../controllers/scholarContols/createDegrees");
const instructorCourseResult = require("../controllers/SearchResults/InstructorCourseResult");
const instructorStudents = require("../controllers/InstructorControls/instructorStudents");
const instructorStudentsResults = require("../controllers/SearchResults/instructorStudentsResults");
const instructorStudentSearch = require("../controllers/InstructorControls/instructorStudentSearch");
const totalStudents = require("../controllers/SearchResults/totalStudents");
const getEditResource = require("../controllers/InstructorControls/getEditResource");
const AllResources = require("../controllers/InstructorControls/AllResources");
const editPodcast = require("../controllers/InstructorControls/editPodcasts");
const editbook = require("../controllers/InstructorControls/editBook");
const editPublication = require("../controllers/InstructorControls/editPublication");
const editTutorial = require("../controllers/InstructorControls/editTutorials");
const getDeleteResource = require("../controllers/InstructorControls/getDeleteResource");
const DeleteTutorial = require("../controllers/InstructorControls/deleteTutorial");
const DeletePodcast = require("../controllers/InstructorControls/deletePodcast");
const DeletePublication = require("../controllers/InstructorControls/deletePublication");
const Deletebook = require("../controllers/InstructorControls/deleteBook");
const SearchResources = require("../controllers/InstructorControls/searchResourceQuery");
const FilterResources = require("../controllers/InstructorControls/filterREsourcesQuery");
const instructorReviews = require("../controllers/InstructorControls/instructorReviews");
const AllReviews = require("../controllers/InstructorControls/AllReviews");
const SortReviews = require("../controllers/InstructorControls/SortReviews");
const getEditCourse = require("../controllers/InstructorControls/getEditCourse");
const editCourse = require("../controllers/InstructorControls/editCourse");
const SearchinstructorCourse = require("../controllers/InstructorControls/SearchInstructorCourses");
const TotalStudentsCount = require("../controllers/InstructorControls/TotalStudentsCount");
const TotalPublications = require("../controllers/TotalPublications");
const renderTutorialsPage = require("../controllers/renderTutorials");
const createWorkHistory = require("../controllers/createWorkHistory");
const WorkHistoryResult = require("../controllers/SearchResults/WorkHistoryResult");
const ExpertiseResult = require("../controllers/SearchResults/ExpertiseResult");
const createSkill = require("../controllers/createSkill");
const AwardResult = require("../controllers/SearchResults/AwardsResult");
const createAward = require("../controllers/createAward");
const userFollowers = require("../controllers/userFollowers");
const totalFollowersCount = require("../controllers/totalfollowers");
const AccountFollowers = require("../controllers/accountFollowers");
const accountFollows = require("../controllers/accountFollows");
const totalFollowing = require("../controllers/SearchResults/totalFollowing");
const MyCoursesList = require("../controllers/scholarContols/myCoursesresList");
const SearchScholarCourses = require("../controllers/scholarContols/searchScholarCourses");
const createReview = require("../controllers/createReview");
const ReviewsSameCourse = require("../controllers/ReviewsSameCourse");
const EndConnections = require("../controllers/utils/endConnections");
const RestartConnection = require("../controllers/utils/restartConnection");
const db = require("./db.config");
const PlayPodcastFile = require("../controllers/playPodcastFile");
const FollowFromDirectory = require("../controllers/scholarContols/FollowFromDirectory.");

// ADMINISTRATOR
const AdminLoggedIn = require("../controllers/admin/loggedin");
const courseDetail = require("../controllers/admin/utils/CourseDetails");
const UserInfo = require("../controllers/admin/utils/userInfo");
const EnrolledStudents = require("../controllers/admin/utils/enrolledstudents");
const CourseReviews = require("../controllers/admin/utils/courseReviews");
const OpenReviews = require("../controllers/admin/utils/openReviews");
const TotalActivatedCourses = require("../controllers/admin/utils/totalActivatedCourses");
const TotalPendingCourses = require("../controllers/admin/utils/totalPendingCourses");
const TotalCourses = require("../controllers/admin/utils/totalCourses");
const courseList = require("../controllers/admin/utils/courseList");
const ApproveCourses = require("../controllers/admin/utils/approveCourses");
const RejectCourses = require("../controllers/admin/utils/rejectCourse");
const DeleteCourses = require("../controllers/admin/utils/deleteCourse");
const ScholarsList = require("../controllers/admin/utils/ScholarsList");
const TotalBooks = require("../controllers/admin/utils/TotalBooksScholars");
const TotalPodcasts = require("../controllers/admin/utils/TotalPodcasts");
const TotalLinks = require("../controllers/admin/utils/TotalLinks");
const TotalCoursesTaken = require("../controllers/admin/utils/CoursesTaken");
const ScholarDetails = require("../controllers/admin/utils/scholarDetails");
const ScholarDegrees = require("../controllers/admin/utils/scholarDegress");
const AllResources_admin = require("../controllers/admin/utils/scholarResources");
const TotalResourcesCount = require("../controllers/admin/utils/countResources");
const TotalActiveResources = require("../controllers/admin/utils/countActiveResources");
const TotalPendingResources = require("../controllers/admin/utils/countPendingResources");
const AdminResourcesMain = require("../controllers/admin/utils/adminResourcesMain");
const SearchResources_admin = require("../controllers/admin/utils/searchResources");
const FilterResources_admin = require("../controllers/admin/utils/filterResources");
const ApproveItem = require("../controllers/admin/utils/approveItem");
const RejectItem = require("../controllers/admin/utils/rejectItem");
const DeleteItem = require("../controllers/admin/utils/deleteItem");
const InstructorRequests = require("../controllers/admin/utils/instructor/instructorRequests");
const ApproveInstructorAccount = require("../controllers/admin/utils/instructor/ApproveInstructorAccount");
const RejectInstructorAccount = require("../controllers/admin/utils/instructor/RejectInstructorAccount");
const CompletedCourses = require("../controllers/admin/utils/dashboard/countCompletedCourses");
const EnrolledCourses = require("../controllers/admin/utils/dashboard/countEnrolledCourses");
const TotalINstructors = require("../controllers/admin/utils/dashboard/countTotalInstructors");
const TotalScholars = require("../controllers/admin/utils/dashboard/countTotalScholars");
const pendingResources = require("../controllers/admin/utils/dashboard/countpendingResources");
const uploadedResources = require("../controllers/admin/utils/dashboard/countAllRecources");
const TotalInstructorCourses = require("../controllers/admin/utils/instructor/TotalInstructorCourses");
const TotalInstructorStudents = require("../controllers/admin/utils/instructor/TotalInstructorStudents");
const InstructorsList = require("../controllers/admin/utils/instructor/InstructorsList");
const InstructorDetails = require("../controllers/admin/utils/instructor/InstructorDetails");
const AllInstructorCourses = require("../controllers/admin/utils/instructor/AllInstructorCourses");
const ValidateFollower = require("../controllers/ValidateFollowers");
const CreateNewPassword = require("../controllers/createNewPassword");
const CountNewUploads = require("../controllers/admin/utils/countNewUploads");
const CountNewInstructorRequests = require("../controllers/admin/utils/countNewInstructorRequests");
const register_admin = require("../controllers/admin/register");
const login_admin = require("../controllers/admin/login");
const logout_admin = require("../controllers/admin/logout");
// const { SelectMeetings } = require("./queries");
const crypto = require('crypto');
const SendWelcomeEmail = require("../controllers/admin/sendEmail");
const { createProxyMiddleware } = require('http-proxy-middleware');
const getLinksForLibrary = require("../controllers/libraryLinks");
const GetBooksForLibrary = require("../controllers/libraryBooks");
const updateAccount = require("../controllers/updateAccount");
const CombinePDF = require("../controllers/external/combinePDF");
const shareFrom = require("../controllers/shareFrom");
const LoggedInExternal = require("../controllers/loggedInExternal");
const ValidateLogin = require("../controllers/external/validateLogin");
const LoggedInONPosters = require("../controllers/loggedInOnPosters");
const PresenterDetails = require("../controllers/external/presenterDetails");
const find_info_for_SEO = require("../controllers/find_info_forSEO");
const {pushNotification, sendNotification, NotificationReceived}= require("../controllers/services/pushNotification");
const path = require("path");
const envConfig = require("../controllers/services/envVonfig");
const unsubscribeNOtification = require("../controllers/services/unregisterService");
const NotificationLoggedIN = require("../controllers/notificationLoggedIn");
const getGoogleProfile = require("../controllers/services/getGoogleScholarProfile");
const PosterDeckChat = require("../controllers/external/posterDeckChat");
const privateChatFile = require("../controllers/chatFileTransfers/privateChatFiles");
const AllChatFiles = require("../controllers/chatFileTransfers/getAllChatFiles");
const SpaceChatFile = require("../controllers/chatFileTransfers/spaceChatFileUpload");
const getSingleFileForMessage = require("../controllers/chatFileTransfers/getSingleFileForMessage");
const getASFIRJPublications = require("../controllers/SearchResults/getUserASFIRJPublications");
const AllNotifications = require("../controllers/SearchResults/getAllNotifications");
const feedsPage = require("../controllers/scholarContols/feedsPage");
const getPeopleFollowed = require("../controllers/feed/getPeopleFollowed");
const getUserInfo = require("../controllers/SearchResults/UserInfo");
const fetchRecentMessages = require("../controllers/chatFileTransfers/getRecentChats");
const fetchChatHistory = require("../controllers/chatFileTransfers/getChatHistory");
const openFile = require("../controllers/external/openFile");
const getChatUsers = require("../controllers/chatFileTransfers/getChatUserInfo");
const saveMessage = require("../controllers/chatFileTransfers/saveMessage");
const saveSpaceMessage = require("../controllers/chatFileTransfers/saveSPaceMessage");
const validateSpaceKey = require("../controllers/spaces/validateSpaceKey");
const acceptSpaceInvitation = require("../controllers/spaces/acceptSpaceinvitation");
const inviteUserToSpace = require("../controllers/spaces/inviteUsersToSpace");
const approveJoinRequest = require("../controllers/spaces/approveJoinRequest");
const joinSpaceWaitingRoom = require("../controllers/spaces/joinWaitingRoom");
const JoinSpace = require("../controllers/spaces/joinSpace");
const getWaitingList = require("../controllers/spaces/getWaitingList");
const updateSpaceData = require("../controllers/spaces/updateSpaceData");
const SpaceSettings = require("../controllers/spaces/spaceSettings");
const GetUsersToInvite = require("../controllers/spaces/usersList");
const acceptInvitationPage = require("../controllers/spaces/acceptInvitationPage");
const getMessageNotifications = require("../controllers/chatFileTransfers/getMessageNotifications");
const mergeAPI = require("../controllers/external/mergeAPI");
const deleteFile = require("../controllers/external/deleteFile");
const getProfilePublications = require("../controllers/profile/getASFIPublicationsFrProfile");
const siteMap = require("../controllers/services/siteMap");
const deleteSpace = require("../controllers/spaces/deleteSpace");
const getAllPodcasts = require("../controllers/podcasts/getAllPodcasts");
const asfiMeetFileUpload = require("../controllers/external/asfiMeetFileUpload");
const ChatInChat = require("../controllers/PrivateChatInChat");
const adminProfileSettings = require("../controllers/admin/pages/profileSettings");
const PrivateChatRoomAdmin = require("../controllers/privateChatAdmin");
const CreateAnnouncement = require("../controllers/admin/createAnnouncement");
const previewAnnouncement = require("../controllers/previewAnnouncement");
const linkPreviewPage = require("../controllers/feed/linkPreviewPage");
const FollowUserFromFeed = require("../controllers/scholarContols/followUserFromFeed");
const UnfollowFromFeed = require("../controllers/scholarContols/unfollowUser");
const updateSpaceCover = require("../controllers/spaces/updateSpaceCover");
const maybeRunGetAllSavedScholars = require("../controllers/feed/SaveGoogleInMonths");
const saveReaction = require("../controllers/feed/saveReactions");
const getReactions = require("../controllers/feed/getReactions");
const openNotifications = require("../controllers/notifications/openNotifications");
const openMessageNotifications = require("../controllers/notifications/openMessageNotification");
const countMyNotifications = require("../controllers/notifications/countMyNotifications");
const markAsRead = require("../controllers/notifications/markAllAsRead");

// ADMINISTRATOR 



const router = express.Router();
router.use(express.json({ limit: '5000mb' }));
router.use(express.urlencoded({ limit: '5000mb', extended: true }));
// router.use(express.json())
// router.use(express.urlencoded({ extended: true }));
// Example: Proxy all requests to /api to a different service
// router.use('/home', createProxyMiddleware({
//     target: 'https://asfischolar.org', // Change to your target service
//     changeOrigin: true, // If the target server requires the host header to match
//     pathRewrite: {
//         '^/home': '', // Remove '/api' from the beginning of the path
//     },
// }));


// Enable CORS for this router
router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });

router.get("/", LoggedIn, (req,res)=>{

    if(req.user){
        const username_new = req.user.username
        res.render("start.ejs", {status :"logged", logger:"logged", user : username_new })
       }
       else{
        // res.redirect("/home")
    }
})

router.get("/posters", (req,res)=>{
    res.redirect("https://asfischolar.com/posters")
})


router.get("/home", (req,res)=>{
   if(req.cookies.userRegistered){
    res.render("home", {status :"no", logger:"Not logged in", user :"", });
    }else{
    res.render("home", {status :"no", logger:"Not logged in", user :"", });

    }
})
 
router.get("/embedMega", (req,res)=>{
    res.render("embedMega")
}) 
// router.get("/home", (req,res) =>{
//     res.render("home", {
//         UserName: "ASFIScholar", accountType:"scholar_account", FirstName:"ASFI", LastName: "Scholar", ProfileImage: "avatar.jpg", Email:"asfischolar@gmail.com"
//     })
// })
router.get("/app", NotificationLoggedIN, (req, res) => {
    if(req.cookies.userRegistered){
    const username_new = req.user.username
    res.render("start.ejs", {status :"logged", logger:"logged", user : username_new })
    }else{
    res.render("start.ejs", {status :"no", logger:"Not logged in", user :""})
    
    }
  
   
})

// GET THE DASHBOARD PAGE 
router.get("/dashboard", LoggedIn, dashboard)
// Count total number of students for the instructor dashboard 
router.get("/getTotalinstructorStudents", LoggedIn, TotalStudentsCount)

// GET the toal publications count on the scholar dashboard 
router.get("/getTotalScholarPublications", LoggedIn, TotalPublications)

// GET NOTIFICATIONS 
router.get("/getNewChatNotifications", LoggedIn, NewNotifications)
router.get("/getAllNotifications", LoggedIn, AllNotifications)
// GET TOTAL COURSES 
router.get("/:username/totalcourses", totalCourses)
router.get("/:username/totalfollowing", totalFollowing)

router.get("/:username/totalstudents", totalStudents)

router.get("/userprofile/image/profileImage/:username", async (req,res)=>{
    const username = req.params.username
    const query = `SELECT * FROM user_info WHERE username =? OR email = ?`
    db.query(query, [username, username], async(err, data)=>{
        if(err) throw err

        if(data[0]){
        res.json({profile_image: data[0].profile_picture, first_name: data[0].first_name, last_name:data[0].last_name})
        }else{
            res.json({profile_image: "", first_name: "", last_name:""})
        }
    })
})


// GET Links for Library
router.get("/getAllLinksOnLibrary", getLinksForLibrary)
router.get("/getAllBooksOnLibrary", GetBooksForLibrary)

// GET THE LIBRARY
router.get("/library", LoggedIn, library)


// GET OPEN BOOK
router.get("/library/b/:bookID",LoggedInExternal, book)

// GET Download Book
router.get("/library/books/:downloadFile",LoggedIn, BookDownload)

// Search for Books 
router.get("/books/:q",LoggedIn, bookSearchResults)


// UPLOAD BOOKS TO THE library
router.get("/uploadBook", LoggedIn, (req,res) => {
    res.render("bookUpload.ejs")
})

router.post("/uploadBook", LoggedIn, uploadBooks)

// router.post("/uploadBook/u", uploadBooks)


// GET Podcast
router.get("/podcasts",LoggedIn, UserPodcast)
router.post("/getAllPodcasts", LoggedIn, getAllPodcasts)

//GET PodcastFile
router.get("/podcasts/download/:downloadFile", LoggedIn, DownloadPodcast)
router.get("/podcasts/:EncryptedFileName/:FileOwner", LoggedInExternal, PlayPodcast)

// Search for a podcast by name or owner name 
router.get("/podcasts/:q",LoggedIn, podcastSearchResults)

// GET Podcast From uesr Profile
router.get("/@:username/podcasts",LoggedIn, UserPodcast)
// ALLOW USERS TO UPLOAD PODCASTS

// router.get("/uploadPodcast", (req,res) => {
//     res.render("podcastUpload.ejs", {root:"./public"})
// })

router.post("/uploadPodcast/u", createPodcast)


// GET THE DIRECTORY
router.get("/directory", LoggedIn, Directory)
// FOR FOLLOWING FROM THE DIRECTORY
router.post("/directory", LoggedIn, FollowFromDirectory)

// GET THE SPACES
router.get("/spaces", LoggedIn, Spaces)


// GET the spaces to feed to the directory 
router.get("/directorySpaces", LoggedIn, getSpaces)

// SEARCH THE DIRECTORY 
router.get("/scholars/:scholarsearch", scholarSearchResults)

// GET THE SPACES INTERFACE
router.get("/spaces/:spaceid", LoggedIn, SpacesChat)
// GET SPACE PARTICIPANTS
router.get("/getSpaceParticipants/:spaceid",SpaceParticipants)
// GET TOTAL PARTICIPANTS 
router.get("/spaces/total/perticipants/:spaceId", async(req,res)=>{
    const spaceId = req.params.spaceId
    const query = "SELECT COUNT(*) AS participantsCount FROM space_participants WHERE space_id = ?" 
    
    db.query(query, spaceId, async(err, data)=>{
        if(err) throw err
        res.json({ParticipantsCount:data[0].participantsCount})
    })
})
// GET SPACE CHAT HISTORY 
router.get("/getSpaceChatHistory/:spaceid", SpaceChatHistory)
// Exit Space 
router.get("/exitSpace/:spaceid",LoggedIn, ExitSpace)

// Create New spaces 
router.post("/createSpaces", LoggedIn, createSpaces)


// GET the accounts a user follows
router.get("/directory/userFollows/:page", LoggedIn, getFollowing)

// GEt the other Accounts users do not follow 
router.get("/directorydiscoverAccounts", LoggedIn, getDiscover)


//GET THE PROFILE PAGE
router.get("/@:username",LoggedIn, profile_page, find_info);

// GET THE PROFILE PAGE BY THE ID 
router.get("/s/:username",LoggedIn, profile_page, find_info);

// GET THE PROFILE PAGE FOR SEO 
router.get("/v/:username", LoggedInExternal, find_info_for_SEO);
// GET THE TUTORIALS PAGE 
router.get("/tutorials", LoggedIn, renderTutorialsPage)
router.get("/feedTutorials", LoggedIn, displayTutorials)

// GET THE CREAT COURSE PAGE 
router.get("/NewCourse", (req, res) => {
    res.render("createCourse")
})
router.get("/createCourse", LoggedIn, CreateCoursePage)
router.post('/api/scholar/newCourse', createCourse);

// CREATE TUTORIALS WITH POST ON MODAL 
router.get("/createTutorial", (req, res) =>{
    res.render("createTutorial")
})
router.post('/api/scholar/newTutorial', createTutorial)



// GET THE COURSES PAGE 
router.get("/courses", LoggedIn, (req,res)=>{
    res.redirect("/tutorials?q=courses")
})

// ge the courses and add them to the create course Select options 
router.get("/:owner/getCoursesForDropdown", LoggedIn, AllCourses)

// get the Categories for drop down 
router.get("/getCategoriesForDropdown", LoggedIn, AllCategories)

router.get("/tutorials?q=courses",LoggedIn, displayCoursesOnly)
router.get("/tutorial/:q",LoggedIn, tutorialSearchResults)
router.get("/:tutorialOwner/tutorialsByAuthor", LoggedIn, tutorialsByAuthor)
router.get("/:tutorialOwner/:tutorialCategory/tutorialsSameCourse", LoggedIn, TutorialOfSameCategory)
router.get("/getAllCourseCategories", CourseCategories)
router.get("/filterCategory/:filter",FilterCoursesInCategory)
router.get("/getAllAsTutorials", getAsTutorial)
router.get("/getAllAsCourses", getAsCourses)
router.get("/getAllAsLevels/:level", getAsLevels)

// GET THE VIDEO CONFERENCING PAGE  
router.get("/vc", (req,res) => {
    res.redirect(`/vc/${uuidv4()}`)
})
router.get("/vc/:room", LoggedIn, videoConference)


// DELETE THE ABOVE IF THE BELOW WORKS PERFECTLY 
router.get("/join-meeting", LoggedIn, render_vc)

router.get("/meetings/m/:roomId/u/:userId", render_main_room)
 
// Render Private chat room 
router.get("/@:username/chat", LoggedIn, PrivateChatRoom)
router.get("/@:username/chat-in-chat", LoggedIn, ChatInChat)



// Iinstructor Students
router.get("/instructorStudents",LoggedIn, instructorStudents)

// GET ALL Applied students for instructors  
router.get("/getInstructorStudents", LoggedIn, instructorStudentsResults)

// GET Student Search Query 
router.get("/instructorStudents/:searchInput", LoggedIn, instructorStudentSearch)


//GET THE MAIN TUTORIAL VIDEO INTERFACE
router.get("/:tutorialOwner/:courseID/:tutorialID", LoggedIn, watchTutorials);

//Update user Profile and show the settings page
router.get("/settings", LoggedIn, ProfileSettings)
router.post("/api/updateAccount", LoggedIn, updateAccount)
// GET PROFILE IMAGES 
router.get("/files/uploaded/images/:filename", async (req,res)=>{
    const fileName = req.params.filename;
if(fileName != "avatar.jpeg" && fileName != "" && fileName != "cover.jpg"){

    db.query("SELECT * FROM files WHERE filename =?", [fileName], async(err,data)=>{
        if(err) throw err
        if(data[0]){

    const query = 'SELECT * FROM files WHERE filename = ?';
    const values = [fileName]; 
  
    try {         
      db.query(query, values, async(err,result)=>{
        if(err) throw err
        const fileData = result[0].filedata;
        // Set appropriate headers for the response
        // res.setHeader('Content-Type', 'application/pdf');
        // res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/octet-stream'); 
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.send(fileData); // Send the file data as the response
      })
 
    } catch (error) {
      console.error('Error retrieving file:', error);
      res.status(500).send('Error retrieving file');
    }
}else{
    console.log(`File, ${fileName} Not Found`)
}
})
}else{
    console.log(fileName)
}

})

// TEmporarily Create Pocast File for Playing.ejs 
router.get("/files/uploaded/podcast/:buffer", PlayPodcastFile)


// Create work history 
router.get("/Work", (req,res)=>{
    res.render("workHistoryForm")
})
router.post("/createworkHistory", LoggedIn, createWorkHistory)

// create Skill 
router.get("/skillForm", (req,res) =>{
    res.render("skillForm")
})
router.post("/createSkill", LoggedIn, createSkill)

// Create Awards 
router.get("/awardsForm", (req,res)=>{
    res.render("awardsForm")
})
router.post("/createAward", LoggedIn, createAward)

// GET THE WORK HISTORY OF A USERS 
router.get("/getWorkHistoryOf/:username", LoggedIn, WorkHistoryResult)
// GET SKills 
router.get("/getSkillsOf/:username", LoggedIn, ExpertiseResult)
// GET AWARDS 
router.get("/getAwardsOf/:username", LoggedIn, AwardResult)

// GET the Degrees for profiles
router.get("/getDegrees/:username", getDegree)

// CREATE NEW DEGREE 
router.post("/createNewDegrees", LoggedIn, createDegrees)

//Upload images to the database
router.post("/profilePhoto/u", LoggedIn, ProfileUpload);

// GET THE LIST OF PEOPLE YOU FOLLOW FROM THE SETTINGS PAGE 
// router.get("/@:loggedUser/following", LoggedIn, userFollows)
router.get("/following", LoggedIn, userFollows)
router.get("/totalFollowersCount", LoggedIn, totalFollowersCount)

// all followers
router.get("/followers", LoggedIn, userFollowers)
router.get("/userFollowers/:loggedUser", LoggedIn, AccountFollowers)
router.get("/userFollows/:loggedUser", LoggedIn, accountFollows)
router.get("/api/userFollowers", LoggedIn, userFollowers)
router.get("/check/validate/follower/:username", LoggedIn, ValidateFollower)
router.post("/follow", LoggedIn, FollowUserFromFeed)
router.post("/unfollow", LoggedIn, UnfollowFromFeed)
// GET THE LOGIN PAGE 

router.get("/login", async (req, res) => {
    // await RestartConnection()
    res.render("loginPage")
})

router.get("/register", (req, res) => {
    // res.sendFile("register.html",  {root:"./public"})
    res.render("register")
})

// SEND REULTS TO THE USER
router.get("/myresults", (req, res) =>{
    res.render("results.ejs", { 
    UserName: "ASFIScholar", accountType:"user_account", FirstName:"ASFI", LastName: "Scholar", ProfileImage: "avatar.jpg", Email:"asfischolar@gmail.com"})
}) 

// RESET USER PASSWORD 
router.get("/passwordReset", (req, res) =>{
    res.render("forgotPassword")
})
 
router.get("/easyFlex/reset",(req,res)=>{

    const emailData = JSON.parse(req.cookies.resetPasswordData) || {}
    if(emailData){
        res.render("confirmCode.ejs", {emailData:emailData, message:emailData.message, email:emailData.email})
    }else{
        // res.render("confrimCode", {emailData:emailData, message:req.session.emailData.message, email:req.session.emailData.email})
        res.redirect("/passwordReset")
    } 
})


router.get("/createPassword", (req,res) => {
    
    const emailData = JSON.parse(req.cookies.resetPasswordData)|| {}
    const ConfrimCodeData_ = req.session.tokenData || {}

    if(emailData.email){
        res.render("newPassword", {ConfrimCodeData_:ConfrimCodeData_, message:emailData.message, email:emailData.email})
    }else{
        res.redirect("/passwordReset")
        console.log("NO SESSION DATA")
    }
})

router.get("/instructorCourses",LoggedIn, instructorCourses)

router.get("/getInstructorCourse", LoggedIn, instructorCourseResult)

router.get("/getMycoursesList", LoggedIn, MyCoursesList)



// Stuff from Funso 
router.get("/deleteAccount", LoggedIn, deleteAccountPage)
router.get("/deleteAccount/del/", LoggedIn, DeleteAccountTrue)



router.get("/becomeInstructor",LoggedIn, (req,res) =>{
   
    if(!req.user){
    res.render("becomeInstructor", {
        UserName: "", accountType:"", FirstName:"", LastName: "", ProfileImage: "", Email:"",  logger:"logged", user : "", ProfileImage:"", UserFirstname:"", UserLastName:"", Course:"Course", CourseYear:"CourseYear", accountType:"", UserName:"", Email:"", username:"", Username:"", UserName:"",
    })
}else{
    
    const username = req.user.username
    const FirstName = req.user.first_name
    const LastName = req.user.last_name
    const accountType = req.user.acct_type
    const profilePicture = req.user.profile_picture
    const Email = req.user.email
    
    if(accountType !== "instructor_account"){
    res.render("becomeInstructor", {
        UserName: username, accountType:accountType, FirstName:FirstName, LastName: LastName, ProfileImage: profilePicture, Email:Email,  logger:"logged", user : req.user.username, ProfileImage:req.user.profile_picture, UserFirstname:req.user.first_name, UserLastName:req.user.last_name, Course:"Course", CourseYear:"CourseYear", accountType:req.user.acct_type, UserName:req.user.username, Email:req.user.email, username:req.user.username, Username:req.user.username, UserName:req.user.username,
    })
    }else{
        res.redirect("/dashboard")
    }
}
})

router.get("/aboutus", (req,res)=>{
    res.render("aboutUs")
})

router.get("/instructorReviews", LoggedIn, instructorReviews)
// GET ALL reviews 
router.get("/getAllReviews", LoggedIn, AllReviews)
router.get("/instructorReviews/rating", LoggedIn, SortReviews)

// Creata a review from teh courses interface 
router.post("/createReview", LoggedIn, createReview)

router.get("/getAllCourseReviews", LoggedIn, ReviewsSameCourse)


router.get("/becomeScholar",LoggedIn, becomeScholarPage)
router.post("/becomeScholar", createScholar)

router.get("/contactUs", (req,res) =>{
    res.render("contactUs", {
        UserName: "ASFIScholar", accountType:"scholar_account", FirstName:"ASFI", LastName: "Scholar", ProfileImage: "avatar.jpg", Email:"asfischolar@gmail.com"
    })
})
router.get("/contact", (req,res) =>{
    res.render("contactUs", {
        UserName: "ASFIScholar", accountType:"scholar_account", FirstName:"ASFI", LastName: "Scholar", ProfileImage: "avatar.jpg", Email:"asfischolar@gmail.com"
    })
})
router.get("/forgotpassword", (req,res) =>{
   res.redirect("passwordReset")
})



router.get("/scholarAssets", LoggedIn, Assets)

// EDIT RESOURCE MODAL 
router.get("/editResourceModal/:editData", LoggedIn, getEditResource)
router.get("/deleteResourceModal/:deleteData", LoggedIn, getDeleteResource)


// GET ALL RESOURCES 
router.get("/myAssets", LoggedIn, Assets)
router.get("/getAllResources", LoggedIn, AllResources)

// EDIT PODCAST ON ASSETS Page 
router.post("/myAssets/update/podcast", LoggedIn, editPodcast)
router.post("/myAssets/update/book", LoggedIn, editbook)
router.post("/myAssets/update/publication", LoggedIn, editPublication)
router.post("/myAssets/update/tutorials", LoggedIn, editTutorial)

// DELETE ASSETS for user
router.post("/myAssets/delete/tutorial", LoggedIn, DeleteTutorial)
router.post("/myAssets/delete/podcast", LoggedIn, DeletePodcast)
router.post("/myAssets/delete/publication", LoggedIn, DeletePublication)
router.post("/myAssets/delete/book", LoggedIn, Deletebook)

// Search Resources 
router.get("/myAssets/search/q/:searchQuery", LoggedIn, SearchResources)
router.get("/myAssets/search/type/:filterQuery", LoggedIn, FilterResources)


router.get("/mycourses", LoggedIn, userCourse)
// edit courses
// get the course modal 
router.get("/editInstructorCourseModal/:editData", LoggedIn, getEditCourse )
// edit the data
router.post("/courses/update/course", LoggedIn, editCourse)
// SearchForCourses 
router.get("/mycourses/search/q/:searchQuery", LoggedIn, SearchinstructorCourse)

// Search for Scholar personal course ther enrolled for  
router.get("/scholarCourses/search/q/:searchQuery", LoggedIn, SearchScholarCourses)


router.post("/coverImage", LoggedIn, profileCoverUpload)


// Get Announcement page 
router.get("/announcement", LoggedInExternal, previewAnnouncement )

// FOR ADMIN 
// DASHBOARD AND DASHBOARD DATA 
router.get("/:SessionId/admin", (req,res)=>{
    const SessionId = req.params.SessionId
    db.query("SELECT * FROM user_info WHERE buffer =?",[SessionId], async (err, data)=>{
        if(err) throw err
        if(data[0]){
            res.render("sign-in")
        }else{
            res.render("error", {message:"Unathorized Access", page:"/"})
        }
    })
})
router.get("/admin/pages/dashboard/user", AdminLoggedIn, async (req,res)=>{
    res.render("admin-dashboard",{username:req.admin.username, firstName:req.admin.first_name, adminPicture:req.admin.profile_picture, email:req.admin.email, LastName:req.admin.last_name})
 
})

router.get("/admin/dashboard/countCourses/completed",AdminLoggedIn, CompletedCourses)
router.get("/admin/dashboard/countCourses/enrolled",AdminLoggedIn, EnrolledCourses)
router.get("/admin/dashboard/instructors/registeredCount",AdminLoggedIn, TotalINstructors)
router.get("/admin/dashboard/scholars/registeredCount",AdminLoggedIn, TotalScholars)
router.get("/admin/dashboard/count/pending/resources",AdminLoggedIn, pendingResources)
router.get("/admin/dashboard/count/uploaded/resources",AdminLoggedIn, uploadedResources)
router.post("/makeAnnouncement", AdminLoggedIn, CreateAnnouncement)
// END DASHBOARD 

router.get("/admin/courses",AdminLoggedIn, (req,res) =>{
    res.render("admin-course-list", {username:req.admin.username, firstName:req.admin.first_name, adminPicture:req.admin.profile_picture, email:req.admin.email, LastName:req.admin.last_name})
})
 
router.get("/admin/pages/courses/categories",AdminLoggedIn, (req,res) =>{
    res.render("admin-course-category",{username:req.admin.username, firstName:req.admin.first_name, adminPicture:req.admin.profile_picture, email:req.admin.email, LastName:req.admin.last_name})
})

// COURSE DETAILS 
router.get("/admin/course/details/:courseId",AdminLoggedIn, (req,res) =>{
    const courseID = req.params.courseId
    res.render("admin-course-detail", {CourseID:courseID, username:req.admin.username, firstName:req.admin.first_name, adminPicture:req.admin.profile_picture, email:req.admin.email, LastName:req.admin.last_name})
})
// feed data to the course Details Page 
router.get("/getcoursedetails/:courseId",AdminLoggedIn, courseDetail)
// Get user info 
router.get("/admin/query/users/:username",AdminLoggedIn, UserInfo)
// Get Enrolled Students 
router.get("/enrolledstudents/:courseId",AdminLoggedIn, EnrolledStudents)
// GEt the course REviews 
router.get("/courseReviews/:courseId",AdminLoggedIn, CourseReviews)
// Open a Review and Read it 
router.get("/openReview/:reviewId",AdminLoggedIn, OpenReviews)
// END COURSE DETAILS 


// >>>>>> Courses PAGE 
router.get("/admin/getTotalActivatedCourses",AdminLoggedIn, TotalActivatedCourses)
router.get("/admin/getTotalPendingCourses",AdminLoggedIn, TotalPendingCourses)
router.get("/admin/getTotalCourses",AdminLoggedIn, TotalCourses)
router.get("/admin/getAllCourses",AdminLoggedIn, courseList)
router.post("/approveCourse",AdminLoggedIn, ApproveCourses)
router.post("/rejectCourse",AdminLoggedIn, RejectCourses)
router.post("/deleteCourse",AdminLoggedIn, DeleteCourses)
// >>>> ENd Course PAge 

router.get("/admin/v3/courses/create", AdminLoggedIn,(req,res)=>{
    res.render("admin-create-course", {username:req.admin.username, firstName:req.admin.first_name, adminPicture:req.admin.profile_picture, email:req.admin.email, LastName:req.admin.last_name})
})
router.get("/admin/v2/pages/announcement", AdminLoggedIn, (req,res) =>{
    res.render("admin-announcement", {username:req.admin.username, firstName:req.admin.first_name, adminPicture:req.admin.profile_picture, email:req.admin.email, LastName:req.admin.last_name})
})

router.get("/admin/courses/edit/:courseId",AdminLoggedIn, (req,res)=>{
    res.render("admin-edit-course-detail")
})

// INSTRUCTOR CONTENT 
router.get("/admin/instructors",AdminLoggedIn, (req,res)=>{
    res.render("admin-instructor-list", {username:req.admin.username, firstName:req.admin.first_name, adminPicture:req.admin.profile_picture, email:req.admin.email, LastName:req.admin.last_name})
})
router.get("/admin/totalCourse/instructor/:username",AdminLoggedIn, TotalInstructorCourses)
router.get("/admin/instructors/totalStudents/:username",AdminLoggedIn, TotalInstructorStudents)
router.get("/admin/allInstructors",AdminLoggedIn, InstructorsList)
router.get("/admin/instructors/details/:username",AdminLoggedIn, InstructorDetails)
router.get("/allInstructorCourses/:username",AdminLoggedIn, AllInstructorCourses )



router.get("/admin/pages/instructors/requests",AdminLoggedIn, (req,res)=>{
    res.render("admin-instructor-request", {username:req.admin.username, firstName:req.admin.first_name, LastName:req.admin.last_name, adminPicture:req.admin.profile_picture, email:req.admin.email})
})

// END INSTRUCTOR CONTEXT 

router.get("/admin/review",AdminLoggedIn, (req,res)=>{
    res.render("admin-review", {username:req.admin.username, firstName:req.admin.first_name, LastName:req.admin.last_name, adminPicture:req.admin.profile_picture, email:req.admin.email})
})

// SCHOLAR DETAILS 
router.get("/admin/scholars/details/:username",AdminLoggedIn, ScholarDetails)
router.get("/scholars/degrees/:username",AdminLoggedIn, ScholarDegrees)
router.get("/allResources/:username",AdminLoggedIn, AllResources)
router.get("/resources/totalResources",AdminLoggedIn, TotalResourcesCount)
router.get("/resources/active",AdminLoggedIn, TotalActiveResources)
router.get("/resources/pending", TotalPendingResources)
router.get("/admin/getAllResources",AdminLoggedIn, AdminResourcesMain)
router.get("/myAssets/search/q/:searchQuery",AdminLoggedIn,  SearchResources)
router.get("/myAssets/search/type/:filterQuery",AdminLoggedIn, FilterResources)
router.get("/approveResource/:ItemType",AdminLoggedIn,ApproveItem )
router.get("/rejectResource/:ItemType",AdminLoggedIn, RejectItem)
router.get("/deleteResource/:ItemType",AdminLoggedIn, DeleteItem)

// END SCHOLAR DETAILS 

router.get("/admin/scholars/requests",AdminLoggedIn, (req,res)=>{
    res.render("/admin-scholar-request", {username:req.admin.username, firstName:req.admin.first_name, LastName:req.admin.last_name, adminPicture:req.admin.profile_picture, email:req.admin.email})
})

router.get("/admin/pages/settings/me", AdminLoggedIn, (req,res) =>{
    console.log("adminLogin")
    res.render("admin-setting", {username:req.admin.username, firstName:req.admin.first_name, LastName:req.admin.last_name, adminPicture:req.admin.profile_picture, email:req.admin.email})
})

router.get("/admin/settings",AdminLoggedIn, ProfileSettings)
// router.get("/admin/settings",AdminLoggedIn, adminProfileSettings)




// Get scholars 
router.get("/admin/students",AdminLoggedIn, (req,res) =>{
    res.render("admin-student-list", {username:req.admin.username, firstName:req.admin.first_name, LastName:req.admin.last_name, adminPicture:req.admin.profile_picture, email:req.admin.email})
})

router.get("/admin/allScholars",AdminLoggedIn, ScholarsList)
router.get("/totalCourseTaken/pages/scholar/:username",AdminLoggedIn, TotalCoursesTaken)
router.get("/totalBooks/:username",AdminLoggedIn, TotalBooks)
router.get("/totalPodcasts/:username",AdminLoggedIn, TotalPodcasts)
router.get("/totalLinks/:username",AdminLoggedIn, TotalLinks)
// END SCHOLARS 

// ISNTRUCTOR REQUESTS 
router.get("/admin/admin/instructors/uploadRequests",AdminLoggedIn, (req,res)=>{
    res.render("InstructorUploadRequests", {username:req.admin.username, firstName:req.admin.first_name, LastName:req.admin.last_name, adminPicture:req.admin.profile_picture, email:req.admin.email})
})
router.get("/admin/instructors/account/requests", InstructorRequests)
router.post("/instructors/applications/accept/:username",AdminLoggedIn, ApproveInstructorAccount)
router.post("/instructors/applications/reject/:username",AdminLoggedIn, RejectInstructorAccount)

// END INSTUCTOR REQUESTS
router.get("/admin/pages/scholars/uploadRequests",AdminLoggedIn, (req,res)=>{
    res.render("ScholarUploadRequests", {username:req.admin.username, firstName:req.admin.first_name, LastName:req.admin.last_name, adminPicture:req.admin.profile_picture, email:req.admin.email})
})

// GET POSTERS Management PAge
router.get("/admin/pages/posters/all", AdminLoggedIn, (req,res)=>{
    const user = req.cookies.adminRegistered
    res.render('posterManagement.ejs',{username:req.admin.username, firstName:req.admin.first_name, LastName:req.admin.last_name, adminPicture:req.admin.profile_picture, email:req.admin.email, meetingEndpoint:process.env.ASFI_MEET_ENDPOINT, user})
    // res.redirect(`${process.env.ASFI_MEET_ENDPOINT}/posters/${req.cookies.adminRegistered}`)
})

// GET THE LIVE EVENTS PAGE 
router.get("/admin/pages/pages/asfimeet/events",AdminLoggedIn, (req,res) =>{
    const user = req.cookies.adminRegistered

    res.render("liveEventsManagement",{username:req.admin.username, firstName:req.admin.first_name, LastName:req.admin.last_name, adminPicture:req.admin.profile_picture, email:req.admin.email,meetingEndpoint:process.env.ASFI_MEET_ENDPOINT, user})
    // res.redirect(`${process.env.ASFI_MEET_ENDPOINT}/meetings/${req.cookies.adminRegistered}`)

})

// Count NEw upload Requests
router.get("/admin/upload/request/count", CountNewUploads)
// Count Instructor Request
router.get("/admin/instructors/request/count",AdminLoggedIn, CountNewInstructorRequests)


// GET POLLS
router.get("/admin/pages/polls/all",AdminLoggedIn, async (req,res)=>{
    res.render("pollsManagement.ejs")
})
router.get("/admin/sign-in", async(req,res)=>{
    if(req.admin){
        res.redirect("/admin/pages/dashboard/user")
    }else{
    res.redirect("/admin/sign-in.html")
    }
})
router.get("/v2/chat/:username", AdminLoggedIn, PrivateChatRoomAdmin)

router.post("/admin/pages/login/oauth/verify", login_admin)

router.get("/admin/sign-in.html", (req,res)=>{
    if(req.admin){
        res.redirect("/admin/pages/dashboard/user")
    }else{
        res.render("sign-in")
    }
})

// router.get("/admin/query/pages/signup", (req,res)=>{
//     res.render("sign-up")
// })

// CREATE INSTRUCTOR ACCOUNT
router.post("/adminstrator/create/new/secured", register_admin)

router.get("/admin/forgotPassword", (req,res)=>{
    res.render("forgot-password")
})
// GET ADMIN INFO 
router.get("/admin/search/info/get/profile", AdminLoggedIn, async (req,res)=>{
    const Username = req.admin.username 
    db.query("SELECT * FROM user_info WHERE username = ? AND acct_type = 'administrator' ", [Username], (err, result) => {
        if (err) {
          console.log(err);
        }
    if(result.length > 0){

    const FirstName = result[0].first_name
    const LastName = result[0].last_name
    const Email = result[0].email
    const ProfilePicture = result[0].profile_picture

    res.json({
        UserName:Username,
        FirstName:FirstName,
        LastName:LastName,
        Email: Email,
        ProfilePicture:ProfilePicture
    })
}else{
    res.json({
        UserName:"unset",
        FirstName:"unset",
        LastName:"unset",
        Email: "unset",
        ProfilePicture:"unset",
    }) 
}

})

})
router.get("/admin/logout/kill/session", logout_admin)
router.get("/api/email/:year/:emailTo/:fullname/:subject", async (req,res) =>{

    // Function to generate MD5 hash
    function generateMD5(input) {
    const hash = crypto.createHash('md5');
    hash.update(input);
    return hash.digest('hex');
    }


    const email  = req.params.emailTo
    const fullname = req.params.fullname
    const subject = req.params.subject
    const year = req.params.year
    const encryptedButton = generateMD5(email)
    const resetToken = req.query.resetToken
    let message
    if(resetToken){
 message = `
    <div><img src="https://res.cloudinary.com/dll8awuig/image/upload/v1717282518/raysonFinance_lg8whf.jpg" width=100% alt=www.raysonfinance.org></div>
    <h2>Your Password Reset Code is</h2>
    <h1>${resetToken}</h1>
    <p>Please ignore if this wasn't requested by you</p>
  
    <p>(c) ${year} . Rayson Fiance</p>
    `
    }else{
        message = `
        <div><img src="https://res.cloudinary.com/dll8awuig/image/upload/v1717282518/raysonFinance_lg8whf.jpg" width=100% alt=www.raysonfinance.org></div>
        <h1>Hi there, ${fullname}</h1>
        <h2>Thanks For Joining us,</h2>
        <p>Please proceed to, verify your email, make a deposit and start earning.</p>
        <p><a href=https://www.raysonfinance.org/0auth?email=${email}&verify=${encryptedButton}>
        <button style='padding:10px 50px 10px 50px; display:flex; align-self:center; alignt-items:center; justify-self:center; background:dodgerblue; color:white; border:none; outline:none; border-radius:24px; text-align:center;  justfy-content:center;'>
        Verify Email
        </button></a></p>
        <p>(c) ${year} . Rayson Finance</p>`
    }
    SendWelcomeEmail(email, fullname, subject, message)
})
 
router.post("/email/external", async(req,res) =>{
    const {to, fullname, subject, html} = req.body
    SendWelcomeEmail(to, fullname, subject, html)
})
router.post("/forgot/password/main", forgotPassword)
router.post("/api/create/new/password", CreateNewPassword)

router.get("/welcome/email",(req,res)=>{
    res.render("welcomeEmail") 
})
router.get("/logout", logout)

// #xternal ENdpoints for Other applications 
router.post("/external/api/combinePDF", CombinePDF)
router.post("/external/api/validateLogin", ValidateLogin)
router.post("/external/api/createSpace", createSpaces) 

// Share From ASFIRJ
router.get("/share", LoggedInExternal,  shareFrom)
router.get("/chat/:spaceid/v/:token", LoggedInONPosters, PosterDeckChat)

// push notifications 
router.post("/subscribe", NotificationLoggedIN, pushNotification)
router.post("/send-notification", sendNotification)
router.post('/api/notification-received', NotificationReceived)
router.post("/getConfig", envConfig)
router.post("/unsubscribe", unsubscribeNOtification)

// GEt PROFILE DETAILS FRO EXERNAL 
router.get("/p/s/v/details/:email", PresenterDetails)

// UPLOAD Files In Chat 
router.post("/uploadPrivateChatFIles", LoggedIn, privateChatFile)
router.post("/getAllChatFiles", AllChatFiles)
router.post("/uploadSpaceChatFIles", LoggedIn, SpaceChatFile)
router.post("/chatUsers", LoggedIn, getChatUsers)
router.post("/getSingleChatFile", getSingleFileForMessage)
router.get("/getAuthorASFIRJPublication", LoggedIn, getASFIRJPublications)
router.get("/getUserPublications", LoggedIn, getProfilePublications)
router.get("/item", openFile)
router.post("/y/saveMessage", saveMessage)
router.post("/y/saveSpaceMessage", saveSpaceMessage)

// GEt messag enotifications  
router.post("/getMessageNotifications", LoggedIn, getMessageNotifications)
router.post("/openNotification", LoggedIn, openNotifications)
router.post("/openMessageNotification", LoggedIn, openMessageNotifications)
router.post("/countNotifcations", LoggedIn, countMyNotifications)
router.post("/markAllAsRead", LoggedIn, markAsRead)
// Feeds page 
router.get("/feed", LoggedInExternal, feedsPage)
// Get the feed of people user follows
router.get("/getPeopleFeed", LoggedIn, getPeopleFollowed)
router.post("/feed/saveReaction", LoggedIn, saveReaction)
router.post("/feed/getReactions", LoggedIn, getReactions)

// Get user public data  
router.get("/getUserPublicData/:username", getUserInfo)
// get recent chats  
router.post("/recentChatList", LoggedIn, fetchRecentMessages)
router.post("/getChatHistory", LoggedIn, fetchChatHistory)
router.get("/s/m/p/:spaceid/settings", LoggedIn, SpaceSettings)
// link Preview page 
router.get("/link", LoggedInExternal, linkPreviewPage)

// Space functions 
router.post("/validateSpaceKey", LoggedIn, validateSpaceKey)
router.post("/acceptSpaceInvitations", LoggedInExternal, acceptSpaceInvitation)
router.post("/inviteToSpace", LoggedIn, inviteUserToSpace)
router.post("/approveSpaceRequest", LoggedIn, approveJoinRequest)
router.post("/joinSpaceRoom", LoggedIn, joinSpaceWaitingRoom)
// router.post("/joinSpace", LoggedIn, JoinSpace)
router.post("/getWaitingList", LoggedIn, getWaitingList)
router.post("/updateSpaceSettings", LoggedIn, updateSpaceData)
router.post("/editSpaceCoverPhoto", LoggedIn, updateSpaceCover)
router.get("/directory/users/spaces/:space_id", LoggedIn, GetUsersToInvite)
router.get("/s/m/spaces/accept/:space_id", LoggedInExternal, acceptInvitationPage)

router.get('/sitemap.xml', siteMap)
 
// GEt SCholar Profile 
router.get("/findGoogleScholar", getGoogleProfile) 
router.post("/deleteSpace/:space_id", LoggedIn, deleteSpace)

maybeRunGetAllSavedScholars()
// For ASFIRJ FILE PROCESSING 
router.post("/mergeFilesAPI", mergeAPI)
router.post("/deleteFileAPI", deleteFile)


// For ASFIMeet file processing 
router.post("/asfimeetfileupload", asfiMeetFileUpload)


router.get('*', (req,res) => {
    res.status(404).render('error.ejs', {status: "Page doesn't exist", page:"/"})
})
module.exports = router;