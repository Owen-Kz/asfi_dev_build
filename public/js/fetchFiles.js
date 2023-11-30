const ProfilePhoto = document.getElementById("profilePhoto")
const profileImageContainer = document.querySelectorAll(".profileImageContainer")
const VisitedpPofilePhoto = document.getElementById("VisitedpPofilePhoto")
const personProfilePicture = document.querySelectorAll(".personImageContainer")
const CoverPhotoContainer = document.querySelector(".cover_image_container")
const CoverPhotoMain = document.getElementById("CoverPhotoMain")

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
if(ProfilePhoto){
   
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
}


async function fetchProfileImage(Image) {
    if (Image !== "avatar.jpg" && Image !== "cover.jpg") {
        try {
            const response = await fetch(`/files/uploaded/images/${Image}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const blob = await response.blob();
            const fileURL = URL.createObjectURL(blob);
            return fileURL;
        } catch (error) {
            console.error('There was a problem fetching the image:', error);
            // Handle errors, display a message, etc.
            return null;
        }
    } else {
        return null;
    }
}



if (CoverPhotoContainer) {
    if(CoverPhotoMain.value != "avatar.jpg" && CoverPhotoMain.value != "cover.jpg" && CoverPhotoMain.value != ""){


    async function setCoverPhotoImage() {
        try {
            const coverPhoto = await fetchProfileImage(CoverPhotoMain.value);

            // Check if the coverPhoto exists and is not null or undefined
            if (coverPhoto) {
                CoverPhotoContainer.style.background = `url(${coverPhoto}) no-repeat center center / cover`;
            } else {
                // Handle scenario where coverPhoto is null or undefined
                console.error('Cover photo is null or undefined');
            }
        } catch (error) {
            console.error('There was an error setting cover photo:', error);
            // Handle errors, display a message, etc.
        }
    }

    // Call the function
    setCoverPhotoImage(); 
}

}
