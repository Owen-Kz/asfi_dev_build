import { quill2, quill } from "./quill.js"

const announcementForm  = document.getElementById("announcementForm")

if(announcementForm){
    announcementForm.addEventListener("submit", (e) =>{
        e.preventDefault()
        const title = document.getElementById("titleMain").value

        const formData = {
            title:title,
            content: JSON.stringify(quill2.getContents().ops)
        }
    //     formData.append("title", title)
    // formData.append('content', JSON.stringify(quill2.getContents().ops));
    fetch(`/makeAnnouncement`, {
        method:"POST",
        headers:{
            "content-type" : "application/json"
        },
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data =>{
        if(data.success){
            alert (data.success)
        }else{
            alert(data.error)
        }
    })
    })
}