const form = document.getElementById("studentSearchForm")
const searchInput = document.getElementById("searchStudent")

form.addEventListener("submit", function(e){
    e.preventDefault();
    fetch(`/instructorStudents/${searchInput.value}`, ()=>{
        method:"GET"
    }).then(res => res.json())
    .then(data =>{

        const StudentsearchArray = JSON.parse(data.StudentSearchResult)
        updateStudentUI(StudentsearchArray)
       
    })
})
