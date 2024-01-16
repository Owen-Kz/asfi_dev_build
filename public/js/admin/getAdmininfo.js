const FullNameContainer = document.getElementById("fullNameContainer")
const EmailContainer = document.getElementById("emailContainer")
const ProfilePictureContainer = document.querySelectorAll(".profilePictureContainer")

function GetAdminInfo(){
 fetch(`/admin/search/info/get/profile`, {
        method: "GET",
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
}

GetAdminInfo()

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