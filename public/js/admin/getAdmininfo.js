// function getCookie(cookieName) {
//     const name = cookieName + "=";
//     const decodedCookie = decodeURIComponent(document.cookie);
//     const cookieArray = decodedCookie.split(';');
//     for (let i = 0; i < cookieArray.length; i++) {
//         let cookie = cookieArray[i];
//         while (cookie.charAt(0) == ' ') {
//             cookie = cookie.substring(1);
//         }
//         if (cookie.indexOf(name) == 0) {
//             return cookie.substring(name.length, cookie.length);
//         }
//     }
//     return null; // Cookie not found
// }



const FullNameContainer = document.getElementById("fullNameContainer")
const EmailContainer = document.getElementById("emailContainer")
const ProfilePictureContainer = document.querySelectorAll(".profilePictureContainer")




    fetch(`/admin/search/info/get/profile`, {
        method: "GET"
    }).then(res => res.json())
        .then(async data => {
            console.log(data)
            if (data) {
                const username = data.UserName
                const profilePicture = data.ProfilePicture
                const FirstName = data.FirstName
                const LastName = data.LastName
                const Email = data.Email
                let Profileimage
 
                if (profilePicture == 'avatar.jpg') {
                    Profileimage = await fetchProfileImage("dummy.jpg")
                } else {
                    Profileimage = await fetchProfileImage(profilePicture)
                }
            // document.addEventListener("DOMContentLoaded", function () {


                FullNameContainer.innerHTML = `<span>${FirstName} ${LastName}</span>`
                EmailContainer.innerHTML = `<span>${Email}</span>`
                ProfilePictureContainer.forEach(image => {
                    image.setAttribute("src", `${Profileimage}`)
                })
            // })

            }


})

async function fetchProfileImage(Image) {
    let imageToFind
    if (Image == "avatar.jpg") {
        imageToFind = "dummy.jpg"
    } else {
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