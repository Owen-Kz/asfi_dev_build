
fetch("/getInstructorCourse", ()=>{
    method: "GET"
}).then(res => res.json())
.then(data =>{
    const AllCourses = JSON.parse(data.All_InstructorCourses)
    // console.log(AllCourses)
    updateCourseUI(AllCourses)
})