form.addEventListener("submit", () =>{
    const login = {
        user: user.value,
        pass: pass.value
    }
    fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(login),
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
            // error.style.marginTop = "0px";
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
            window.location.reload()

        }
        })
    })

    // module.exports = login;



    function show_pass() {
        var pass = document.getElementById("pass");
        if (pass.type === "password") {
          pass.type = "text";
        } else {
          pass.type = "password";
        }
      }