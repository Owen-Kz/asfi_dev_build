const email = document.getElementById("email")

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
    })    .then((response) => {
        if (response.status === 200) {
            // alert("afafafaf")
          // Redirect to the new page if the response is successful
        window.location.href = `/EmailConfirmation`; // Change to the actual route
        }
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
        // Handle the error here if needed
      });
})

