// GET FORM EDIT
const editSection = document.getElementById("edit_section");

fetch("/editResourceModal", ()=>{
    method: "GET"
}).then(res => res.json())
.then(data =>{
    editSection.innerHTML = ""
    if(data.type == "book"){
        const bookTitle = data.book_title
        const bookYear = data.book_year
        const NewFormData =`<form action="" id="editBook">
        <label class="form-label">Edit Book Title</label>
        <input type="text" id="bookTitleEdit" class="form-control" value="${bookTitle}"> <br>
        <label class="form-label">Edit Book Year</label>
        <input type="text" id="bookYearEdit" class="form-control" value="${bookYear}">
    </form>`
    updateEditModal(NewFormData)

    }else if(data.type == "publication"){
        const publicationURL = data.publication_url
        const NewFormData1 = `<form action="" id="editPublication">
        <label class="form-label">Edit Publication URL</label>
        <input type="text" id="publicationURLEdit" class="form-control" value="${publicationURL}"> <br>
    </form>`

    updateEditModal(NewFormData1)

    }else if(data.type == "podcast"){
        const podcastTitle = data.podcast_title
        const NewFormData2 = `<form action="" id="editPodcast">
        <label class="form-label">Edit Podcast Title</label>
        <input type="text" id="podcastTitleEdit" class="form-control" value="${podcastTitle}"> <br>
    </form>`

    updateEditModal(NewFormData2)

    }else if(data.type == "tutorial"){
        const tutorialTitle = data.tutorial_title
        const tutorialDescription = data.tutorial_description
        const NewFormData3 = `<form action="" id="editTutorial">
        <label class="form-label">Edit Tutorial Title</label>
        <input type="text" id="tutorialTitleEdit" class="form-control" value="${tutorialTitle}"> <br>
        <label class="form-label">Edit Tutorial Description</label>
        <textarea name="tutorialDescription" id="tutorialDescriptionEdit" cols="30" rows="10" class="form-control" value="${tutorialDescription}"></textarea>
    </form>`

    updateEditModal(NewFormData3)
    }
})

// GET FORM DELETE
const deleteSection = document.getElementById("delete_section");

fetch("/deleteResourceModal", ()=>{
    method: "GET"
}).then(res => res.json())
.then(data =>{
    editSection.innerHTML = ""
    if(data.type == "book"){
        const bookTitle = data.book_title
        const bookYear = data.book_year
        const NewFormData =`<form action="" id="deleteBook">
        <label class="form-label">Edit Book Title</label>
        <input type="text" id="bookTitleDelete" class="form-control" value="${bookTitle}" readonly> <br>
        <label class="form-label">Edit Book Year</label>
        <input type="text" id="bookYearDelete" class="form-control" value="${bookYear}" readonly>
    </form>`

    updateDeleteModal(NewFormData)

    }else if(data.type == "publication"){
        const publicationURL = data.publication_url
        const NewFormData1 = `<form action="" id="deletePublication">
        <label class="form-label">Delete Publication URL</label>
        <input type="text" id="publicationURLDelete" class="form-control" value="${publicationURL}" readonly> <br>
    </form>`

    updateDeleteModal(NewFormData1)

    }else if(data.type == "podcast"){
        const podcastTitle = data.podcast_title
         const NewFormData2 = `<form action="" id="deletePodcast">
        <label class="form-label">Edit Podcast Title</label>
        <input type="text" id="podcastTitleDelete" class="form-control" value="${podcastTitle}" readonly> <br>
    </form>`

    updateDeleteModal(NewFormData2)

    }else if(data.type == "tutorial"){
        const tutorialTitle = data.tutorial_title
        const tutorialDescription = data.tutorial_description
        const NewFormData3 = `<form action="" id="deleteTutorial">
        <label class="form-label">Edit Tutorial Title</label>
        <input type="text" id="tutorialTitleDelete" class="form-control" value="${tutorialTitle}" readonly> <br>
        <label class="form-label">Edit Tutorial Description</label>
        <textarea name="tutorialDescription" id="tutorialDescriptionDelete" cols="30" rows="10" class="form-control" value="${tutorialDescription}" readonly></textarea>
    </form>`

    updateDeleteModal(NewFormData3)
    }
})