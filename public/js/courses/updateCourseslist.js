function UpdateCoursesUI(courseArray, data){
    const List = courseArray
    CourseListContainer.innerHTML = `<tr><td><span>Loading.....</span></td></tr>`
        if(List.length > 0){
            CourseListContainer.innerHTML = ``
            const CurrentPage = data.currentPageCourses
            const TotalPages = data.totalPagesCourses
            const TotalCourses = data.totalCourses
            const PrevPage = Math.floor(parseInt(CurrentPage) - 1)
            const NexxtPage = Math.floor(parseInt(CurrentPage) + 1)
            List.forEach(course => {
                let course_status_text
                let course_action
                const Course_name = course.course_name
                const course_id = course.course_id
                const course_duration = course.course_duration
                const course_description = course.course_description
                const course_thumbnail = course.course_thumbnail
                const course_level = course.course_level
                const course_status = course.course_status
                const course_category = course.course_category
                const date_uploaded = formatTimestamp(course.date_created)
                const course_instructor = course.course_instructor


                if(course_status == "pending" || course_status == "applied"){
                    course_status_text = `<span class="badge bg-warning bg-opacity-15 text-warning">Pending</span>`

                    course_action = `
                    <form class="approveCourseForm">
                    <input type='hidden' value=${course_id} id='ApproveCourse'>
                    <button class="btn btn-sm btn-success-soft me-1 mb-1 mb-md-0" type="submit">Approve</button>
                    </form>

                    <form class="rejectCourseForm">
                    <input type='hidden' value=${course_id} id='RejectCourse'>
                    <button class="btn btn-sm btn-secondary-soft bg-danger mb-0 bg-opacity-15 text-danger" type="submit">Reject</button>
                    </form>`

                }else if(course_status == "live"){
                    course_status_text =   `<span class="badge bg-success bg-opacity-15 text-success">Live</span>`
                    course_action = `<a href="/admin/courses/edit/${course_id}" class="btn btn-sm btn-success me-1 mb-1 mb-md-0">Edit</a>`
                }else if(course_status == "rejected"){
                    course_status_text =   `<span class="badge bg-danger bg-opacity-15 text-danger">Rejected</span>`
                    course_action = `
                    <form class="approveCourseForm">
                    <input type='hidden' value=${course_id} id='ApproveCourse'>
                    <button class="btn btn-sm btn-success-soft me-1 mb-1 mb-md-0" type="submit">Approve</button>
                    </form>

                    <form class="DeleteCourseForm">
                    <input type='hidden' value=${course_id} id='DeleteCourse'>
                    <button class="btn btn-sm btn-danger mb-0" type="submit">Delete</button>
                    </form>`
                }
                fetch(`/admin/query/users/${course_instructor}`, ()=>{
                    method: "GET"
                }).then(res => res.json())
                .then(data =>{
                    const Data = JSON.parse(data.UserInfo)
                    const ProfilePicture = Data[0].profile_picture
                    const Fullname = `${Data[0].first_name} ${Data[0].last_name}`;

                    let ProfileSource

                    if(ProfilePicture == "avatar.jpg"){
                        ProfileSource = `https://eu.ui-avatars.com/api/?background=random&amp;name=${Fullname}&amp;font-size=0.6`
                    }else{
                        ProfileSource = `https://asfi-demo-app-2cbea9ef1c2f.herokuapp.com/userUploads/profileImages/${ProfilePicture}`
                    }



                CourseListContainer.innerHTML += `	<tr>
                <!-- Table data -->
                <td>
                    <div class="d-flex align-items-center position-relative">
                
                        <h6 class="table-responsive-title mb-0 ms-2">	
                            <a href="#" class="stretched-link">${Course_name}</a>
                        </h6>
                    </div>
                </td>

                <!-- Table data -->
                <td>
                    <div class="d-flex align-items-center mb-3">
                        <!-- Avatar -->
                        <div class="avatar avatar-xs flex-shrink-0">
                            <img class="avatar-img rounded-circle" src="${ProfileSource}" alt="avatar">
                        </div>
                        <!-- Info -->
                        <div class="ms-2">
                            <h6 class="mb-0 fw-light">${Fullname}</h6>
                        </div>
                    </div>
                </td>

                <!-- Table data -->
                <td>${date_uploaded}</td>

                <!-- Table data -->
                <td> <span class="badge text-bg-primary">${course_level}</span> </td>

                <!-- Table data -->
                <td><a href="/admin/course/details/${course_id}" class="btn btn-sm btn-dark me-1 mb-1 mb-md-0">View</a></td>

                <!-- Table data -->
                <td> ${course_status_text} </td>

                <!-- Table data -->
                <td>
                    ${course_action}
                </td>
            </tr> `
            InitializeActionForms()
                })


            });
            if(TotalPages > 0){
                // Update the pagination UI
                if(footerContainer){
               const paginationHTML = paginationFotTutorials(CurrentPage, TotalPages, PrevPage, NexxtPage);
               footerContainer.innerHTML = paginationHTML;
                }
            }

        }else{
            CourseListContainer.innerHTML =  `<tr><td>Nothing to show</td></tr>`
          footerContainer.innerHTML = ""
        }
}



// Approve and Reject Course 

function InitializeActionForms(){
   const approveCourseForm = document.querySelectorAll(".approveCourseForm")
   const rejectCourseForm = document.querySelectorAll(".rejectCourseForm")
   const DeleteCourseForm = document.querySelectorAll(".DeleteCourseForm")

//    Approve Course 
   if(approveCourseForm.length > 0){
    approveCourseForm.forEach(form =>{
        const CourseId = form.querySelector("#ApproveCourse")
        const FormData = {
            course_id: CourseId.value
        }
        form.addEventListener("submit", (e)=>{
            e.preventDefault()
            fetch("/approveCourse", {
                method : "POST",
                body: JSON.stringify(FormData),
                headers: {
                'Content-type' : 'application/JSON'
                }
            }).then(res => res.json())
            .then(data =>{
                if(data.status === "success"){
                    alert(data.message)
                    window.location.reload()
                }else if(data.status === "error"){
                    alert(data.message)
                }else{
                    alert("Oops, An error Occured")
                }
            })
        })
    })
   }


//    Reject Course 
if(rejectCourseForm.length > 0){
    rejectCourseForm.forEach(form =>{
        const CourseId = form.querySelector("#RejectCourse")
        const FormData = {
            course_id: CourseId.value
        }
        form.addEventListener("submit", (e)=>{
            e.preventDefault()
            fetch("/rejectCourse", {
                method : "POST",
                body: JSON.stringify(FormData),
                headers: {
                'Content-type' : 'application/JSON'
                }
            }).then(res => res.json())
            .then(data =>{
                if(data.status === "success"){
                    alert(data.message)
                    window.location.reload()
                }else if(data.status === "error"){
                    alert(data.message)
                }else{
                    alert("Oops, An error Occured")
                }
            })
        })
    })
   }


//    Delete Course 
if(DeleteCourseForm.length > 0){
    DeleteCourseForm.forEach(form =>{
        const CourseId = form.querySelector("#DeleteCourse")
        const FormData = {
            course_id: CourseId.value
        }
        form.addEventListener("submit", (e)=>{
            e.preventDefault()
            fetch("/deleteCourse", {
                method : "POST",
                body: JSON.stringify(FormData),
                headers: {
                'Content-type' : 'application/JSON'
                }
            }).then(res => res.json())
            .then(data =>{
                if(data.status === "success"){
                    alert(data.message)
                    window.location.reload()
                }else if(data.status === "error"){
                    alert(data.message)
                }else{
                    alert("Oops, An error Occured")
                }
            })
        })
    })
   }
}