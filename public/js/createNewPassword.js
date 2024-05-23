const Email = document.getElementById("emailNew")
const Password = document.getElementById("password1")
const password2 = document.getElementById("password2")
// const submitNewPassword = document.getElementById("submitNewPassword")

 
$("#submitNewPassword").on("submit", () => {
    const FData = {
        email: Email.value,
        password: Password.value
    } 
    if(Password.value != password2.value){
        alert("Passwords do not match")
    }else{
    fetch("/api/create/new/password", {
        method: "POST",
        body: JSON.stringify(FData), 
        headers:{
            "Content-type" : "application/JSON"
        }
    }).then(res => res.json())
    .then(data =>{
        if(data.message === "PasswordReset"){
            alert("Password Reset Successful Please Login")
            window.location.href = "/login"
        }else{
            alert("An Error Occured! Please try again", data.message)
        }
    })
}
})
