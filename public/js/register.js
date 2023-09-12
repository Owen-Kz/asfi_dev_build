form.addEventListener("submit", () =>{
    const register = {
        firstname: firstname.value,
        lastname: lastname.value,
        username: username.value,
        email: email.value,
        password: password.value
    }
    fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(register),
        headers: { 
            "Content-type" : "application/JSON"
        }
    }).then(res => res.json())
    .then(data => {
        if(data.status == "error") {
            success.style.visibility = "hidden";
            success.style.contentVisibility = "hidden";
            error.style.visibility = "visible";
            error.style.opacity  = "1";
            error.style.contentVisibility = "visible";
            error.style.marginTop = "0px";
            success.style.marginTop = "20px";
            error.innerText = data.error;
        }
        else{
            error.style.visibility = "hidden";
            error.style.contentVisibility = "hidden";
            success.style.visibility = "visible";
            success.style.opacity  = "1";
            success.style.contentVisibility = "visible";
            success.style.marginTop = "0px";
            error.style.marginTop = "-20px";
            success.innerText = data.success;
            
           // Wait for 3 seconds (3000 milliseconds) before redirecting
            setTimeout(function() {
                window.location.href = '/login'; // Replace 'new-page.html' with your desired URL
            }, 2000); // 3000 milliseconds (3 seconds)
            
                    }
        })
    })





    function show_pass() {
        var pass = document.getElementById("password");
        if (pass.type === "password") {
          pass.type = "text";
        } else {
          pass.type = "password";
        }
      }
    // module.exports = register;