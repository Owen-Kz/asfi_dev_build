const username = document.getElementById("userName")
const password = document.getElementById("password")
const loginAdmin = document.getElementById("loginAdmin")
const loginMainAdmin = document.getElementById("loginMainAdmin")

const LoginForm = document.getElementById("adminLoginForm")

loginAdmin.addEventListener("click", function(){
    loginMainAdmin.click()
})


LoginForm.addEventListener("submit", function(e){
    e.preventDefault();
    
    const Credentials = {
        user: username.value,
        pass: password.value,
    }
    if(username.value != "" && password.value != ""){
    fetch("/admin/pages/login/oauth/verify",  {
        method:"POST",
        body: JSON.stringify(Credentials),
        headers:{
            "Content-type" : "application/JSON"
        }
    }).then(res => res.json())
    .then(data =>{
        if(data){
            const message = data.status
            const buffer = data.loginBuffer
            console.log(message, buffer)
            if(message == "success" && buffer){
                window.location.href = "/admin/pages/dashboard/user"
            }else{
                alert(data.error)
            }
        }
    })
}else{
    alert("Fill all fields")
}
})