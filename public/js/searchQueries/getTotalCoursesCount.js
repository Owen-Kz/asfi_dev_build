const total_courses_count = document.getElementById("total_courses_count")
const username_container = document.getElementById("username_container").innerText
const total_followers_count = document.getElementById("total_followers_count")


fetch(`/${username_container}/totalcourses`, ()=> {
    method:"GET"
}).then(res => res.json())
.then(data =>{
    total_courses_count.innerText = data.TotalCourses
})



if(total_followers_count){
fetch(`/${username_container}/totalfollowers`, ()=> {
    method:"GET"
}).then(res => res.json())
.then(data =>{
    total_followers_count.innerText = data.TotalFollowers
})
}




