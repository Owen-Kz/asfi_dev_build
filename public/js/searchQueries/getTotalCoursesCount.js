const total_courses_count = document.getElementById("total_courses_count")
const username_HOLDER = document.getElementById("username_container")

const username_container = username_HOLDER.innerText

const total_followers_count = document.getElementById("total_followers_count")
const total_enrolled_students = document.getElementById("total_enrolled_students")


if(total_courses_count){
fetch(`/${username_container}/totalcourses`, ()=> {
    method:"GET"
}).then(res => res.json())
.then(data =>{
    total_courses_count.innerText = data.TotalCourses
})
}



if(total_followers_count){
fetch(`/${username_container}/totalfollowing`, ()=> {
    method:"GET"
}).then(res => res.json())
.then(data =>{
    total_followers_count.innerText = data.TotalFollowers
})
}


if(total_enrolled_students){
    fetch(`/${username_container}/totalstudents`, ()=> {
        method:"GET"
    }).then(res => res.json())
    .then(data =>{
        total_enrolled_students.innerText = data.TotalStudents
    })
}





