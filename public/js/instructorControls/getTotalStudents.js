const totalStudents = document.getElementById("totalStudents")

fetch("/getTotalinstructorStudents", ()=>{
    method: "GET"
}).then(res => res.json())
.then(data =>{
    totalStudents.innerText = data.TotalStudents
})