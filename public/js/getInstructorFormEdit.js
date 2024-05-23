// GET FORM EDIT
const editSection = document.getElementById("edit_section");
const instructorCoursesContainer = document.getElementById("instructorCoursesContainer")
const edit_course_form = Array.from(instructorCoursesContainer.querySelectorAll(".edit_course_form"));
const delete_course_form =  Array.from(instructorCoursesContainer.querySelectorAll(".delete_course_form"));

function initializeCourseEditForm() {
if(instructorCoursesContainer.querySelectorAll(".edit_course_form").length > 0){
    instructorCoursesContainer.querySelectorAll(".edit_course_form").forEach(form =>{
const courseEdit = form.querySelector("#courseEdit")
        form.addEventListener("submit", (e)=>{
            e.preventDefault();
            const editData = {
            EditID :  courseEdit.value
            }
        fetch(`/editInstructorCourseModal/${JSON.stringify(editData)}`, ()=>{
            method: "GET"
        }).then(res => res.json())
        .then(data =>{
            editSection.innerHTML = ""
            if(data){
                const QueryResult = JSON.parse(data.QueryResult)
               const courseTitle = QueryResult[0].course_name
               const courseId = QueryResult[0].course_id

                const courseDescription = QueryResult[0].course_description

                const NewFormData = `<form method="POST" action="/courses/update/course"  enctype="application/x-www-form-urlencoded">
                <input type="hidden" value="${courseId}" name="courseEditID" id="courseEditID" readonly/>
                <label class="form-label">Edit Course Title</label>
    
                <input type="text" id="courseTitleEdit" name="courseTitleEdit" class="form-control" value="${courseTitle}"> <br>
                <label class="form-label">Edit Course Description</label>
                <textarea name="courseDescription" id="courseDescriptionEdit" name="courseDescriptionEdit" cols="30" rows="10" class="form-control">${courseDescription}</textarea>
                <input type="submit" id="submitEdit" hidden>
            </form>`
        
            updateCourseEditModal(NewFormData)
            }
        })
        })
    })
}
}


// document.addEventListener('DOMContentLoaded', () => {
//     console.log('DOMContentLoaded event fired');
//     initializeCourseEditForm();
// });

// window.addEventListener('load', () => {
//     console.log('load event fired');
//     initializeCourseEditForm();
// });

// // GET FORM DELETE
// const deleteSection = document.getElementById("delete_section");

// fetch("/deleteResourceModal", ()=>{
//     method: "GET"
// }).then(res => res.json())
// .then(data =>{
//     deleteSection.innerHTML = ""
//     if(data){
//         const courseTitle = data.course_title
//         const courseDescription = data.course_description
//         const NewFormData = `<form action="" method="POST" action="/courses/delete/course"  enctype="application/x-www-form-urlencoded">
//         <label class="form-label">Course Title</label>
//         <input type="text" id="courseTitleDelete" class="form-control" value="${courseTitle}" readonly> <br>
//         <label class="form-label">Course Description</label>
//         <textarea name="courseDescription" id="courseDescriptionDelete" cols="30" rows="10" class="form-control" value="${courseDescription}" readonly></textarea>
//     </form>`

//     updateCourseDeleteModal(NewFormData)
//     }
// })