confrimResetCode.addEventListener("submit", () =>{
    const codeConfrimEmail = {
        email:confirmEmail.value,
        code: confirmationCode.value,
        message: `Create A New Password`
    } 
    fetch("/api/confirm-code", {
        method: "POST",
        body: JSON.stringify(codeConfrimEmail),
        headers: {
            "Content-type" : "application/JSON"
        }
    })    .then((response) => {
        if (response.status === 200) {
            // alert("afafafaf")
          // Redirect to the new page if the response is successful

        window.location.href = `/createPassword`; // Change to the actual route
        }
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
        // Handle the error here if needed
      });
})

