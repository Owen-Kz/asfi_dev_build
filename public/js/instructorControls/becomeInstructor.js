


instructorForm.addEventListener("submit", (event) => {
    event.preventDefault(); 
    const gender = document.querySelectorAll(".gender")


    const NewInstructorData = {
        username: username.value,
        first_name: first_name.value,
        last_name: last_name.value,
        dob: dob.value,
        email: email.value,
        phonenumber: phonenumber.value,
        nationality: nationality.value,
        gender: gender.value,
        address: address.value,
        degree: degree.value,
        password: password.value,
        degree_subtext: degree_subtext.value,
        area_of_interest: area_of_interest.value,
        highest_level_education: highest_level_education.value,
        short_bio: short_bio.value
    }
    fetch("/create/newInstructor", {
        method: "POST",
        body: JSON.stringify(NewInstructorData),
        headers: { 
            "Content-type" : "application/JSON",
        }
    }).then(res => res.json())
    .then(data => {
        alert(data.message)
        
    })
    })


    // module.exports = register;