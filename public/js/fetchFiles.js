const ProfilePhoto = document.getElementById("profilePhoto")
const profileImageContainer = document.querySelectorAll(".profileImageContainer")
const VisitedpPofilePhoto = document.getElementById("VisitedpPofilePhoto")
const personProfilePicture = document.querySelectorAll(".personImageContainer")
const CoverPhotoContainer = document.querySelector(".cover_image_container")
const CoverPhotoMain = document.getElementById("CoverPhotoMain")

if(VisitedpPofilePhoto){
    let image 
    if(VisitedpPofilePhoto.value == "avatar.jpg"){
        image = "dummy.jpg"
    }else{
        image = VisitedpPofilePhoto.value
    }
    fetch(`/files/uploaded/images/${image}`, ()=>{
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

//   For Profile Image 
if(ProfilePhoto){
   let imageProfile
if(ProfilePhoto.value == "avatar.jpg"){
    imageProfile = "dummy.jpg"
}else{
    imageProfile = ProfilePhoto.value
}
fetch(`/files/uploaded/images/${imageProfile}`, ()=>{
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


async function fetchProfileImage(Image) {
    let imageToFind
    if(Image == "avatar.jpg"){
        imageToFind = "dummy.jpg"
    }else{
        imageToFind = Image
    }
    if (Image !== "cover.jpg") {
        try {
            const response = await fetch(`/files/uploaded/images/${imageToFind}`);
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

async function fetchPodcast(podcast) {
    if (podcast !== "avatar.jpg" && podcast !== "cover.jpg") {
        try {
            const response = await fetch(`/files/uploaded/podcast/${podcast}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const file = await response.json();

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
