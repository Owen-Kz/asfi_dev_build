const instructorStudentsContainer = document.getElementById("instructorStudentsContainer")


function updateStudentUI(studentData){
    instructorStudentsContainer.innerHTML = ""

    if(studentData.length > 0){
    studentData.forEach(student => {
        const course_name = student.course_name
        const course_id = student.course_id
        const StudenUsername = student.participants_username
        const studentName = student.participants_fullname
        const Course_instructor = student.course_instructor_username
        const CourseProgress = student.course_progress
        const Country = student.participants_country
        const Email = student.participants_email
        const dateApplied = formatTimestamp(student.date_applied)
        
instructorStudentsContainer.innerHTML += `
<tr>
<td>
    <div class="d-flex align-items-center position-relative">
        <div class="mb-0 ms-2">
            <!-- Title -->
            <h6 class="mb-0"><a href="#" class="stretched-link">${studentName}</a></h6>
            <!-- Address -->
            <span class="text-body small"><i class="fas fa-fw fa-map-marker-alt me-1 mt-1"></i>${Country}</span>
        </div>
    </div>
</td>

<!-- Table data -->
<td class="text-center text-sm-start">
    <div class=" overflow-hidden">
        <small class="mb-0">${CourseProgress}</small>
    </div>
</td>

<!-- Table data -->
<td>${course_name}</td>

<!-- Table data -->
<td>${dateApplied}</td>

<!-- Table data -->
<td>
    <a href="mailto:${Email}" class="btn btn-success-soft btn-round me-1 mb-0" data-bs-toggle="tooltip" data-bs-placement="top" title="Message"><i class="far fa-envelope"></i></a>
   
</td>
</tr>
`
    });
}else{
    instructorStudentsContainer.innerHTML = `<tr>
    <td>No data match your search</td></tr>`
    
}
}