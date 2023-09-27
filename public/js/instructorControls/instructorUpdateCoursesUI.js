const courseContainer = document.getElementById("instructorCoursesContainer")

function updateCourseUI(courseArray){
    courseContainer.innerHTML = " "

    if(courseArray.length > 0){
courseArray.forEach(element => {
    const courseTitle = element.course_title    
    const CourseId = element.course_id
    const CourseDescription = element.course_description
    const TotalTutorials = element.tutorials_count
    const course_category =  element.course_category
    const course_status = element.course_status
    const completed_count = element.completed_count
    // const tutorials_count = element.tutorialToCourseCount
    const enrolled_count = element.enrolled_count

    let ClassName
    let Status

    if(course_status == "applied"){
        ClassName = "badge bg-info bg-opacity-10 text-info"
        Status = "Applied"
    }else if(course_status == "live"){
        ClassName = "badge bg-success bg-opacity-10 text-success"
        Status = "Live"
    }else if(course_status == "rejected"){
        ClassName = "badge bg-danger bg-opacity-10 text-danger"
        Status = "Rejected"
    }else if(course_status == "disabled"){
        ClassName = "badge bg-secondary bg-opacity-10 text-secondary"
        Status = "Disabled"
    }

    courseContainer.innerHTML += `
<tr>
    <!-- Course item -->
    <td>
        <div class="d-flex align-items-center">
            <div class="mb-0 ms-2">
                <!-- Title -->
                <h6><a href="#">${courseTitle}</a></h6>
                <!-- Info -->
                <div class="d-sm-flex">
                    <p class="h6 fw-light mb-0 small me-3"><i class="fas fa-table text-orange me-2"></i>${TotalTutorials} lectures</p>
                    <p class="h6 fw-light mb-0 small"><i class="fas fa-check-circle text-success me-2"></i>${completed_count} Completed</p>
                </div>
            </div>
        </div>
    </td>
    <!-- Enrolled item -->
    <td class="text-center text-sm-start">${enrolled_count}</td>
    <!-- Status item -->
    <td>
        <div class="${ClassName}">${Status}</div>
    </td>

    <td class="action-table">
        <form class="edit_course_form">
            <input type="hidden" id="courseEdit" value=${CourseId} readonly>
            <button class="btn btn-sm btn-success-soft btn-round me-1 mb-0" data-bs-toggle="modal" data-bs-target="#editAction"><i class="far fa-fw fa-edit"></i></button>
        </form>
        <br>
        <form class="delete_course_form" style="display:none; visibility:hidden">
            <input type="hidden" id="courseDelete" value=${CourseId} readonly>
            <button class="btn btn-sm btn-danger-soft btn-round mb-0" data-bs-toggle="modal" data-bs-target="#deleteAction"><i class="fas fa-fw fa-times"></i></button>
        </form>
    </td>
</tr>`;


if(url == "/dashboard" ||  url == "/Dashboard"){
    hideActionButtons()
}

});
}else{
    courseContainer.innerHTML = `<tr>
    <td>No data Available</td></tr>`
    
}
if(url !== "/dashboard" && url !== "/Dashboard"){
initializeCourseEditForm()
}
}


if (url == "/dashboard" || url == "/Dashboard") {
    const actionPanelControl  = document.getElementById("actionPanelControl")

    actionPanelControl.setAttribute("style", "display:none")
}
function hideActionButtons(){
    const action_table = document.querySelectorAll(".action-table")

action_table.forEach(tableAction =>{
tableAction.setAttribute("style", "display:none; visibility:hidden; opacity:0")
})
}