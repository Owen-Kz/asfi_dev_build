const courseContainer = document.getElementById("instructorCoursesContainer")

function updateCourseUI(courseArray){

    if(courseArray.lengtth > 0){
        courseContainer.innerHTML = ""
courseArray.forEach(element => {
    const CouresTitle = element.coures_title    
    const CourseId = element.coures_id
    const CourseDescription = element.course_description
    const TotalTutorials = element.tutorials_count
    const course_category =  element.course_category
    const coures_status = element.course_status
    const completed_count = element.completedCount
    const tutorials_count = element.tutorialToCourseCount

    let ClassName
    let Status

    if(coures_status == "applied"){
        ClassName = "badge bg-info bg-opacity-10 text-info"
        Status = "Applied"
    }else if(coures_status == "live"){
        ClassName = "badge bg-success bg-opacity-10 text-success"
        Status = "Live"
    }else if(coures_status == "rejected"){
        ClassName = "badge bg-danger bg-opacity-10 text-danger"
        Status = "Rejected"
    }else if(coures_status == "disable"){
        ClassName = "badge bg-secondary bg-opacity-10 text-secondary"
        Status = "Disable"
    }

    courseContainer.innerHTML += `
<tr>
    <!-- Course item -->
    <td>
        <div class="d-flex align-items-center">
            <div class="mb-0 ms-2">
                <!-- Title -->
                <h6><a href="#">${CouresTitle}</a></h6>
                <!-- Info -->
                <div class="d-sm-flex">
                    <p class="h6 fw-light mb-0 small me-3"><i class="fas fa-table text-orange me-2"></i>${tutorials_count} lectures</p>
                    <p class="h6 fw-light mb-0 small"><i class="fas fa-check-circle text-success me-2"></i>${completed_count} Completed</p>
                </div>
            </div>
        </div>
    </td>
    <!-- Enrolled item -->
    <td class="text-center text-sm-start">0</td>
    <!-- Status item -->
    <td>
        <div class=${ClassName}>${Status}</div>
    </td>

    <td>
        <a href="#" class="btn btn-sm btn-success-soft btn-round me-1 mb-0"><i class="far fa-fw fa-edit"></i></a>
        <button class="btn btn-sm btn-danger-soft btn-round mb-0"><i class="fas fa-fw fa-times"></i></button>
    </td>
</tr>`;
});
}else{
    courseContainer.innerHTML = `<tr>
    <td>No data match your search</td></tr>`
    
}
}