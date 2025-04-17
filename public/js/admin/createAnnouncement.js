import { quill2, quill } from "./quill.js"

const announcementForm  = document.getElementById("announcementForm");

if (announcementForm) {
    announcementForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("titleMain").value;
        const content = JSON.stringify(quill2.getContents().ops);
      

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);

        fetch(`/makeAnnouncement`, {
            method: "POST",
            body: formData
            // Don't set Content-Type manually — browser will handle it for FormData
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert(data.success);
            } else {
                alert(data.error);
            }
        });
    });
}
