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
    }) .then(res => res.json())
    .then(data =>{
      if(data){
         if (data.message === "EmailConfirmed") {
            // alert("afafafaf")
          // Redirect to the new page if the response is successful

        window.location.href = `/createPassword`; // Change to the actual route
        }else{
          alert("Invalid Code Provided")
          
        }
      }else{
        console.error('Error submitting form:', error);

      }
      })
      })
      // .catch((error) => {
      //   console.error('Error submitting form:', error);
      //   // Handle the error here if needed
      // });


