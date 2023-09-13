const CreateScholar = document.getElementById("becomeScholarForm")

CreateScholar.addEventListener("submit", (e)=>{
    e.preventDefault();
        const scholarData = {
        academic_institution: academic_institution.value,
        degree: degree.value,
        degree_subtext: degree_subtext.value,
        scholar_username: scholar_username.value,
        area_of_interest: area_of_interest.value,
        bio: bio.value
    }

    fetch("/becomeScholar", {
        method: "POST",
        body: JSON.stringify(scholarData),
        headers: { 
        "Content-type" : "application/JSON"
           }
    }).then(res => res.json())
     .then(data => {
        alert(data.message)
        window.href.location = '/dashboard'
     })
})

