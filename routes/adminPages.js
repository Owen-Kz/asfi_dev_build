const express = require("express")
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
const AllResources = require("../controllers/admin/utils/scholarResources");
const TotalResourcesCount = require("../controllers/admin/utils/countResources");
const TotalActiveResources = require("../controllers/admin/utils/countActiveResources");
const TotalPendingResources = require("../controllers/admin/utils/countPendingResources");
const AdminResourcesMain = require("../controllers/admin/utils/adminResourcesMain");
const SearchResources = require("../controllers/admin/utils/searchResources");
const FilterResources = require("../controllers/admin/utils/filterResources");
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


const router = express.Router();
router.use(express.json())



module.exports = router;