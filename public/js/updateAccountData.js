let titleValue
const title = document.getElementById("title")
if(title){
    titleValue = title.value
}else{
    titleValue = "N/A"
}

form1.addEventListener("submit", (e) =>{
    e.preventDefault();
    const updateData = {
        firstname: firstname.value,
        lastname: lastname.value,
        username: username.value,
        title: titleValue,
        bio: bio.value,
        NewLocation: newLocation.value,
        usernameValidator: usernameValidator.value,
        phonenumber: phonenumber.value,
        ID_Validator: ID_Validator.value
    }
    fetch("/api/updateAccount", {
        method: "POST",
        body: JSON.stringify(updateData),
        headers: { 
            "Content-type" : "application/JSON",
        }
    }).then(res => res.json())
    .then(data => {
        alert(data.message)
        CreateNewDegree()
        })
    })
    // GENERATE RANDOM ID TO AD TO PODCAST SERACH QUERY 
    function genBuffer() {
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        var passwordLength = 24;
        var bufferID  = "";
        for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        bufferID += chars.substring(randomNumber, randomNumber +1);
        }
       return bufferID 
    }
    function CreateNewDegree(){
        const inputFields = document.getElementsByName('honoraryText[]');
        const honoraryTextField = document.getElementsByName('honoraryName[]');
        const formData = [];
        
        for (let i = 0; i < inputFields.length; i++) {
          const ID = genBuffer();
        
          formData.push({
            id: ID,
            honoraryText: inputFields[i].value,
            honoraryName: honoraryTextField[i].value
          });
        }
        
        
        // Fetch API call to submit 
        if(inputFields.value != ""){
        fetch(`/createNewDegrees/honors`, {
          method: 'POST',
          body: JSON.stringify(formData),
          headers:{
            "Content-type" : "application/JSON"
          }
        })
        .then(response => response.json())  // Adjust based on your server response
        
        .then(data => location.reload())
        .catch(error => console.error('Error:', error));
      }
    }


    // UpDATE LNKS 
    const Facebook = document.getElementById("link-facebook")
    let FacebookValue

    if(Facebook){
        FacebookValue = Facebook.value
        Facebook.addEventListener("keyup", function(){
            FacebookValue = Facebook.value
        })
    }else{
    FacebookValue = "N/A"
    }


    const Twitter = document.getElementById("link-twitter")
    let TwitterValue
    if(Twitter){
        TwitterValue = Twitter.value
        Twitter.addEventListener("keyup", function(){
            TwitterValue = Twitter.value
        })
    }else{
        TwitterValue = "N/A"
    }

    const LinkedIn = document.getElementById("link-linkedin")
    let LinkedInValue 
    if(LinkedIn){
        LinkedInValue = LinkedIn.value
        LinkedIn.addEventListener("keyup", function(){
        LinkedInValue = LinkedIn.value
        })
    }else{
        LinkedInValue = "N/A"
    }

    const instagram = document.getElementById("link-instagram")
    let InstagramValue 
    if(instagram){
        InstagramValue = instagram.value
        instagram.addEventListener("keyup", function(){
        InstagramValue = instagram.value

        })
    }else{
        InstagramValue = "N/A"
    }


    const Youtube = document.getElementById("link-youtube")
    let YoutubeValue
    if(Youtube){
        YoutubeValue = Youtube.value
        Youtube.addEventListener("keyup", function(){
        YoutubeValue = Youtube.value
        })
    }else{
        YoutubeValue = "N/A"
    }

    const GoogleScholar = document.getElementById("link-googlescholar")
    let GoogleScholarValue 
    if(GoogleScholar){
        GoogleScholarValue = GoogleScholar.value
        GoogleScholar.addEventListener("keyup", function(){
        GoogleScholarValue = GoogleScholar.value
        })
    }else{
        GoogleScholarValue = "N/A"
    }


    const ResearchGate = document.getElementById("link-researchgate")
    let ResearchGateValue
    if(ResearchGate){
        ResearchGateValue = ResearchGate.value
        ResearchGate.addEventListener("keyup", function(){
            ResearchGateValue = ResearchGate.value
        })
    }else{
        ResearchGateValue = "N/A"
    }


    const WebOfScience = document.getElementById("link-webofscience")
    let WebOfScienceValue
    if(WebOfScience){
        WebOfScience.addEventListener("keyup", function(){
            WebOfScienceValue = WebOfScience.value
        })
    }else{
        WebOfScienceValue = "N/A"
    }


    const scopus = document.getElementById("link-scopus")
    let scopusValue
    if(scopus){
        scopusValue = scopus.value

        scopus.addEventListener("keyup", function(){
            scopusValue = scopus.value
        })
    }else{
        scopusValue = "N/A"
    }

    const Orcid = document.getElementById("link-orcid")
    let OrcidValue 
    if(Orcid){
        OrcidValue = Orcid.value

        Orcid.addEventListener("keyup", function(){
        OrcidValue = Orcid.value
        })
    }else{
        OrcidValue ="N/A"
    }


    const Academia = document.getElementById("link-academia")
    let AcademiaValue
    if(Academia){
        AcademiaValue = Academia.value

        Academia.addEventListener("keyup", function(){
        AcademiaValue = Academia.value
        })
    }else{
        AcademiaValue = "N/A"
    }

    form2.addEventListener("submit", (e)=> {
        e.preventDefault()
        const LinksData = {
            Facebook: FacebookValue,
            Username: usernameVal.value,
            Twitter: TwitterValue,
            LinkedIn: LinkedInValue,
            instagram: InstagramValue,
            Youtube: YoutubeValue,
            GoogleScholar: GoogleScholarValue,
            ResearchGate: ResearchGateValue,
            WebOfScience: WebOfScienceValue,
            scopus: scopusValue,
            Orcid: OrcidValue,
            Academia: AcademiaValue
        }
        fetch("/api/updateLinks", {
            method: "POST",
            body: JSON.stringify(LinksData),
            headers: { 
                "Content-type" : "application/JSON",
            }
        }).then(res => res.json())
        .then(data => {
            alert(data.message)
            // Reload the current page
            location.reload();
        })
    })


    submitPassword.addEventListener("click", function(e) {
        e.preventDefault()
        const newPassword = document.getElementById("NewPassword").value;
        const confirmPassword = document.getElementById("password_1").value;
        const message = document.getElementById("warningDiv");

        // Regular expressions to check for letters, numbers, and special characters
        const letterRegex = /[a-zA-Z]/;
        const numberRegex = /[0-9]/;
        const specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;

        if (newPassword !== confirmPassword) {
            message.innerHTML = "Passwords do not match!";
            return false;
        } else if (newPassword.length < 8) {
            message.innerHTML = "Password should be at least 8 characters long.";
            return false;
        } else if (!letterRegex.test(newPassword)) {
            message.innerHTML = "Password should contain at least one letter.";
            return false;
        } else if (!numberRegex.test(newPassword)) {
            message.innerHTML = "Password should contain at least one number.";
            return false;
        } else if (!specialCharRegex.test(newPassword)) {
            message.innerHTML = "Password should contain at least one special character.";
            return false;
        } else {
            // Password is valid
            message.innerHTML = "";
            // return true;
            submitMain.click
            // form4.submit()
        }
    })

    const passwordForm = document.getElementById("form4")
    passwordForm.addEventListener("submit", (e)=>{
        e.preventDefault()

        const PasswordFields ={
            username: username_p.value,
            currentPassword:currentPassword.value,
            NewPassword:NewPassword.value,
         
        }

        fetch("/update/newPasword", {
            method:"POST",
            body: JSON.stringify(PasswordFields),
            headers: {
                "Content-type" : "application/JSON",
            }
        }).then(res => res.json())
        .then(data => {
            alert(data.message)
            // Reload the current page
            if(data.message == "Password Updated Succesfully"){
            location.reload();
            }else{

            }
        })
    })