const express = require("express");
const LoggedIn = require("../controllers/loggedin")
const find_info = require("../controllers/find_info")
const profile_page = require("../controllers/profile")
const watchTutorials = require("../controllers/watchTutorials");
const library = require("../controllers/library")
const book = require("../controllers/open-book")
const UserPodcast = require("../controllers/UserPodcast")
const Directory = require("../controllers/directory")
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

const router = express.Router();
router.use(express.json())

router.get("/", LoggedIn, (req,res)=>{
    if(req.user){
        const username_new = req.user.username
        res.render("index.ejs", {status :"logged", logger:"logged", user : username_new })
       }
       else{
        // res.redirect("/home")
    }
})
router.get("/home", (req,res)=>{
    res.render("home.ejs", {status :"no", logger:"Not logged in", user :""});
})

router.get("/app", (req, res) => {
    if(req.cookies.userRegistered){
    const username_new = " "
    res.render("index.ejs", {status :"logged", logger:"logged", user : username_new })
    }else{
    res.render("index.ejs", {status :"no", logger:"Not logged in", user :""})
    
    }
  
   
})

// GET THE DASHBOARD PAGE 
router.get("/dashboard", LoggedIn, dashboard)
// GET NOTIFICATIONS 
router.get("/:username/getNewChatNotifications", LoggedIn, NewNotifications)
// GET THE LIBRARY
router.get("/library", LoggedIn, library)

// GET OPEN BOOK
router.get("/library/b/:bookID",LoggedIn, book)

// GET Download Book
router.get("/library/books/:downloadFile",LoggedIn, BookDownload)

// Search for Books 
router.get("/books/:q",LoggedIn, bookSearchResults)


// UPLOAD BOOKS TO THE library
router.get("/uploadBook", LoggedIn, (req,res) => {
    res.render("bookUpload.ejs")
})

router.post("/uploadBook", uploadBooks)

// router.post("/uploadBook/u", uploadBooks)


// GET Podcast
router.get("/podcasts",LoggedIn, UserPodcast)

//GET PodcastFile
router.get("/podcasts/download/:downloadFile", LoggedIn, DownloadPodcast)
router.get("/podcasts/:EncryptedFileName/:FileOwner", LoggedIn, PlayPodcast)

// Search for a podcast by name or owner name 
router.get("/podcasts/:q",LoggedIn, podcastSearchResults)

// GET Podcast From uesr Profile
router.get("/@:username/podcasts",LoggedIn, UserPodcast)
// ALLOW USERS TO UPLOAD PODCASTS
router.get("/uploadPodcast", (req,res) => {
    res.render("podcastUpload.ejs", {root:"./public"})
})

router.post("/uploadPodcast/u", createPodcast)


// GET THE DIRECTORY
router.get("/directory", LoggedIn, Directory)

// GET the spaces to feed to the directory 
router.get("/directorySpaces", LoggedIn, getSpaces)

// GET THE SPACES INTERFACE
router.get("/spaces/:SpaceId", LoggedIn, SpacesChat)


// GET the accounts a user follows
router.get("/directory/userFollows", LoggedIn, getFollowing)

// GEt the other Accounts users do not follow 
router.get("/directorydiscoverAccounts", LoggedIn, getDiscover)


//GET THE PROFILE PAGE
router.get("/@:username",LoggedIn, profile_page, find_info);

// GET THE TUTORIALS PAGE 
router.get("/tutorials", LoggedIn, displayTutorials)

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


// GET THE VIDEO CONFERENCING PAGE  
router.get("/vc", (req,res) => {
    res.redirect(`/vc/${uuidv4()}`)
})
router.get("/vc/:room", LoggedIn, videoConference)


// DELETE THE ABOVE IF THE BELOW WORKS PERFECTLY 
router.get("/join-meeting", LoggedIn, render_vc)

router.get("/meetings/m/:roomId/u/:userId", render_main_room)
 
// Render Private chat room 
// router.get("/@:username/chat", LoggedIn, PrivateChatRoom)
router.get("/@:username/chat", (req,res) =>{
    res.json({message:"You tried to chat"})
})


//GET THE MAIN TUTORIAL VIDEO INTERFACE
router.get("/:tutorialOwner/:courseID/:tutorialID", LoggedIn, watchTutorials);

//Update user Profile and show the settings page
router.get("/settings", LoggedIn, ProfileSettings)

//Upload images to the database
router.post("/profilePhoto/u", LoggedIn, ProfileUpload);

// GET THE LIST OF PEOPLE YOU FOLLOW FROM THE SETTINGS PAGE 
router.get("/@:loggedUser/following", LoggedIn, userFollows)

// GET THE LOGIN PAGE 
router.get("/public", LoggedIn, (req, res) => {
    if(req.user){
        res.sendFile("public", {root : "./login"})
    }
})

router.get("/login", (req, res) => {
    res.sendFile("login.html", {root:"./public"})
})

router.get("/register", (req, res) => {
    res.sendFile("register.html",  {root:"./public"})
})

// SEND REULTS TO THE USER
router.get("/myresults", (req, res) =>{
    res.render("results.ejs", {root: "./public", 
    UserName: "TestUsername", accountType:"scholar_account", FirstName:"Muhammed", LastName: "Obinna", ProfileImage: "avatar.jpg", Email:"email@hok.com"})
}) 

// RESET USER PASSWORD 
router.get("/passwordReset", (req, res) =>{
    // res.sendFile("forgotPassword.html", {root: "./public"})
    res.render("forgotPassword", {root: "./public"})
})

router.get("/EmailConfirmation",(req,res)=>{
    const emailData = req.session.emailData || {}
    // console.log(req.session)
    if(emailData){
        res.render("confirmCode", {emailData:emailData, message:req.session.emailData.message, email:req.session.emailData.email})
    }else{
        // res.render("confrimCode", {emailData:emailData, message:req.session.emailData.message, email:req.session.emailData.email})
        res.redirect("/passwordReset")
    }
})

router.get("/createPassword", (req,res) => {
    // const emailData = req.session.emailData 
    console.log(req.session)
    const emailData = req.session.emailData || {}
    const ConfrimCodeData_ = req.session.tokenData || {}

    if(ConfrimCodeData_){
        res.render("newPassword", {ConfrimCodeData_:ConfrimCodeData_, message:ConfrimCodeData_.confirmCode, email:emailData.email})
    }else{
        // res.render("confrimCode", {emailData:emailData, message:req.session.emailData.message, email:req.session.emailData.email})
        // res.redirect("/passwordReset")
        console.log("NO SESSION DATA")
    }
})

router.get("/instructorCourses",LoggedIn, instructorCourses)

// router.post("/api/confirmEmail/*", ConfrimEmailReset)
// router.post("/api/passwordReset", forgotPassword) 


// Stuff from Funso 
router.get("/deleteAccount", LoggedIn, deleteAccountPage)
router.get("/deleteAccount/del/", LoggedIn, DeleteAccountTrue)



router.get("/becomeInstructor", (req,res) =>{
    res.render("becomeInstructor", {
        UserName: "TestUsername", accountType:"", FirstName:"Muhammed", LastName: "Obinna", ProfileImage: "avatar.jpg", Email:"email@hok.com"
    })
})

// router.post("/create/newInstructor", createInstructor)

router.get("/becomeScholar", (req,res) =>{
    res.render("becomeScholar", {
        UserName: "TestUsername", accountType:"scholar_account", FirstName:"Muhammed", LastName: "Obinna", ProfileImage: "avatar.jpg", Email:"email@hok.com"
    })
})

router.get("/contactUs", (req,res) =>{
    res.render("contactUs", {
        UserName: "TestUsername", accountType:"scholar_account", FirstName:"Muhammed", LastName: "Obinna", ProfileImage: "avatar.jpg", Email:"email@hok.com"
    })
})

router.get("/forgotpassword", (req,res) =>{
    res.render("forgotpassword", {
        UserName: "TestUsername", accountType:"scholar_account", FirstName:"Muhammed", LastName: "Obinna", ProfileImage: "avatar.jpg", Email:"email@hok.com"
    })
})

router.get("/confirmCode", (req,res) =>{
    res.render("confirmCode", {
        UserName: "TestUsername", accountType:"scholar_account", FirstName:"Muhammed", LastName: "Obinna", ProfileImage: "avatar.jpg", email:"email@hok.com", message:"Confirm Code",
    })
})

router.get("/newPassword", (req,res) =>{
    res.render("newPassword", {
        UserName: "TestUsername", accountType:"scholar_account", FirstName:"Muhammed", LastName: "Obinna", ProfileImage: "avatar.jpg", email:"email@hok.com", message:"Confirm Code",
    })
})

router.get("/home", (req,res) =>{
    res.render("home", {
        UserName: "TestUsername", accountType:"scholar_account", FirstName:"Muhammed", LastName: "Obinna", ProfileImage: "avatar.jpg", Email:"email@hok.com"
    })
})

router.get("/index", (req,res) =>{
    res.render("index", {
        UserName: "TestUsername", accountType:"scholar_account", FirstName:"Muhammed", LastName: "Obinna", ProfileImage: "avatar.jpg", Email:"email@hok.com"
    })
})






router.get("/instructorReviews", (req,res) =>{
    res.render("instructorReviews", {
        UserName: "TestUsername", accountType:"scholar_account", FirstName:"Muhammed", LastName: "Obinna", ProfileImage: "avatar.jpg", Email:"email@hok.com"
    })
})

router.get("/instructorStudents", (req,res) =>{
    res.render("instructorStudents", {
        UserName: "TestUsername", accountType:"scholar_account", FirstName:"Muhammed", LastName: "Obinna", ProfileImage: "avatar.jpg", Email:"email@hok.com"
    })
})

router.get("/scholarAssets", LoggedIn, Assets)

router.get("/myAssets", LoggedIn, Assets)

router.get("/mycourses", LoggedIn, userCourse)


router.post("/coverImage", LoggedIn, profileCoverUpload)




router.get("/logout", logout)

// SEND AN ERROR PAGE IF THE PAGE WASN'T FOUND
router.get('*', (req,res) => {
    res.status(404).render('error.ejs', {status: "Page doesn't exist"})
})


module.exports = router;