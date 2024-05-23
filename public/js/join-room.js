// Generate RANDOM buffer if the user is not logged in 

if(joinAs_type.value == "visitor"){
    genBuffer()
// GENERATE RANDOM ID TO AD TO PODCAST SERACH QUERY 
function genBuffer() {
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
var passwordLength = 8; 
var bufferID  = "";
for (var i = 0; i <= passwordLength; i++) {
var randomNumber = Math.floor(Math.random() * chars.length);
bufferID += chars.substring(randomNumber, randomNumber +1);
}
document.getElementById("joinAs_buffer_visitor").value = bufferID 
}
}
// submit form
joinMeeting_form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the default form submission
    const joinMeeting = []

    if(joinAs_type.value != "visitor"){
         joinMeeting.push({
            meeting_id: roomId.value,
            passcode: passcode.value,
            user_id:joinAs.value,
            user_secret: joinAs_buffer.value,
            firstname: joinAs_firstname.value,
            lastname: joinAs_lastname.value,
            profile_picture: joinAs_profile_picture.value,
            account_type: joinAs_type.value
        })
    }else{
        joinMeeting.push({
            meeting_id: roomId.value,
            passcode: passcode.value,
            user_secret: joinAs_buffer.value,
            user_id: joinAs.value,
            profile_picture: joinAs_profile_picture.value
        })
        
    }


    try {
        const response = await fetch("/api/join-room", {
            method: "POST",
            body: JSON.stringify(joinMeeting),
            headers: {
                "Content-type": "application/json"
            }
        });

        if (response.ok) {
            // If the API call was successful, the server should provide a URL for redirection
            const responseData = await response.json();

            if(responseData){
            // Redirect to the URL received from the server
            window.location.href = `${responseData.redirectUrl}`;
            }else{
                console.log("No room with this Id was found")
            }

        } else {
            console.error("API call failed:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
});
