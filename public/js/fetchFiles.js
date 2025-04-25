let profilePhotoFetch = document.getElementById("profilePhoto")
let profileImageContainerFetch = document.querySelectorAll(".profileImageContainer")
let VisitedpPofilePhoto = document.getElementById("VisitedpPofilePhoto")
let personProfilePicture = document.querySelectorAll(".personImageContainer")
let CoverPhotoContainer = document.querySelector(".cover_image_container")
let CoverPhotoMain = document.getElementById("CoverPhotoMain")
    // fetch(`/files/uploaded/images/${image}`, ()=>{
    //     method:"GET"
    // })
    // .then(response => {
    //     if (!response.ok) {
    //         throw new Error('Network response was not ok');
    //       }
    //       return response.blob(); // Get the response as a Blob
    //     })
    //     .then(blob => {
    //       // Create a URL for the Blob object
    //       let fileURL = URL.createObjectURL(blob);

    //       // Use the fileURL to display the PDF in an iframe or link to download
    //       personProfilePicture.forEach(imageContainer =>{
    //         imageContainer.setAttribute("src", image)
    //     })
     
    
    //   })
    //   .catch(error => {
    //     console.error('There was a problem fetching the image:', error);
    //     // Handle errors, display a message, etc.
    //   });
if(VisitedpPofilePhoto){
    let image 
    if(VisitedpPofilePhoto.value == "avatar.jpg"){
        image = "https://res.cloudinary.com/dll8awuig/image/upload/v1705444097/dc69h8mggh01bvlvbowh.jpg"
    }else{
        image = VisitedpPofilePhoto.value
    }
    // fetch(`/files/uploaded/images/${image}`, ()=>{
    //     method:"GET"
    // })
    // .then(response => {
    //     if (!response.ok) {
    //         throw new Error('Network response was not ok');
    //       }
    //       return response.blob(); // Get the response as a Blob
    //     })
    //     .then(blob => {
    //       // Create a URL for the Blob object
    //       let fileURL = URL.createObjectURL(blob);
      
          // Use the fileURL to display the PDF in an iframe or link to download
          personProfilePicture.forEach(imageContainer =>{
              imageContainer.setAttribute("src", image)
          })
       
      
        // })
        // .catch(error => {
        //   console.error('There was a problem fetching the image:', error);
        //   // Handle errors, display a message, etc.
        // });
}

//   For Profile Image 
if(profilePhotoFetch){
   let imageProfile
if(profilePhotoFetch.value == "avatar.jpg"){
    imageProfile = "https://res.cloudinary.com/dll8awuig/image/upload/v1705444097/dc69h8mggh01bvlvbowh.jpg"
}else{
    imageProfile = profilePhotoFetch.value
}
// fetch(`/files/uploaded/images/${imageProfile}`, ()=>{
//     method:"GET"
// })
// .then(response => {
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return response.blob(); // Get the response as a Blob
//   })
//   .then(blob => {
//     // Create a URL for the Blob object
//     let fileURL = URL.createObjectURL(blob);

    // Use the fileURL to display the PDF in an iframe or link to download
    profileImageContainerFetch.forEach(imageContainer =>{
        imageContainer.setAttribute("src", imageProfile)
    })
 

//   })
//   .catch(error => {
//     console.error('There was a problem fetching the image:', error);
//     // Handle errors, display a message, etc.
//   });
}


async function fetchProfileImage(Image) {
    let imageToFind
    if(Image == "avatar.jpg"){
        imageToFind = "https://res.cloudinary.com/dll8awuig/image/upload/v1705444097/dc69h8mggh01bvlvbowh.jpg"
    }else{
        imageToFind = Image
    }
    if (Image !== "cover.jpg" || Image !== "avatar.jpg") {
        try {
            // let response = await fetch(`/files/uploaded/images/${imageToFind}`);
            // if (!response.ok) {
            //     throw new Error('Network response was not ok');
            // }
            // let blob = await response.blob();
            // let fileURL = URL.createObjectURL(blob);
            
            return Image;
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
            let response = await fetch(`/files/uploaded/podcast/${podcast}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            let file = await response.json();

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
            let coverPhoto = await fetchProfileImage(CoverPhotoMain.value);

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
