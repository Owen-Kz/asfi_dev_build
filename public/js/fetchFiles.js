const ProfilePhoto = document.getElementById("profilePhoto")
const profileImageContainer = document.querySelectorAll(".profileImageContainer")
const VisitedpPofilePhoto = document.getElementById("VisitedpPofilePhoto")
const personProfilePicture = document.querySelectorAll(".personImageContainer")

if(VisitedpPofilePhoto){
    if(VisitedpPofilePhoto.value != "avatar.jpg"){
        fetch(`/files/uploaded/images/${VisitedpPofilePhoto.value}`, ()=>{
            method:"GET"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.blob(); // Get the response as a Blob
            })
            .then(blob => {
              // Create a URL for the Blob object
              const fileURL = URL.createObjectURL(blob);
          
              // Use the fileURL to display the PDF in an iframe or link to download
              personProfilePicture.forEach(imageContainer =>{
                  imageContainer.setAttribute("src", fileURL)
              })
           
          
            })
            .catch(error => {
              console.error('There was a problem fetching the image:', error);
              // Handle errors, display a message, etc.
            });
    }
}

//   For Profile Image 
if(ProfilePhoto.value != "avatar.jpg"){
fetch(`/files/uploaded/images/${ProfilePhoto.value}`, ()=>{
    method:"GET"
})
.then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.blob(); // Get the response as a Blob
  })
  .then(blob => {
    // Create a URL for the Blob object
    const fileURL = URL.createObjectURL(blob);

    // Use the fileURL to display the PDF in an iframe or link to download
    profileImageContainer.forEach(imageContainer =>{
        imageContainer.setAttribute("src", fileURL)
    })
 

  })
  .catch(error => {
    console.error('There was a problem fetching the image:', error);
    // Handle errors, display a message, etc.
  });
}