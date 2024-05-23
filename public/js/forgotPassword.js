import { SetCookies } from "./setCookies.js"

const email = document.getElementById("email")
const resetForm = document.getElementById("resetForm")
resetForm.addEventListener("submit", () =>{
    const resetPassword = {
        email:email.value,
        message: `Code has been sent to ${email.value}`
    } 
    fetch("/forgot/password/main", {
        method: "POST",
        body: JSON.stringify(resetPassword),
        headers: {
            "Content-type" : "application/JSON"
        }
    }) .then(res => res.json())
      .then(data =>{
        if(data.status === "success"){ 
        SetCookies("emailData", data.emailData)
          window.location.href = `/easyFlex/reset`; // Change to the actual rout 
        }else{
          console.log(data.message)
          console.log(data)
        }
      })
})

