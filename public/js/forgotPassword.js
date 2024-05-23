const email = document.getElementById("email")
const resetForm = document.getElementById("resetForm")
resetForm.addEventListener("submit", () =>{
    const resetPassword = {
        email:email.value,
        message: `Code has been sent to ${email.value}`
    } 
    fetch("/api/forgot-password", {
        method: "POST",
        body: JSON.stringify(resetPassword),
        headers: {
            "Content-type" : "application/JSON"
        }
    }) .then(res => res.json())
      .then(data =>{
        if(data.status === "success"){
          console.log(data)
          // window.location.href = `/confirm/email/reset`; // Change to the actual rout 
        }else{
          console.log(data.message)
        }
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
        // Handle the error here if needed
      });
})

