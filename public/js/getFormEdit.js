// GET FORM EDIT
const editSection = document.getElementById("edit_section");

// GET FORM DELETE
const deleteSection = document.getElementById("delete_section");


function initializeEditForm() {

    console.log("Function Running")
const assetContentContainer = document.getElementById("assetContentContainer")
const editAssetForm = Array.from(assetContentContainer.querySelectorAll(".editAssetForm"));
const DeleteAssetForm =  Array.from(assetContentContainer.querySelectorAll(".deleteAssetForm"));


if(editAssetForm.length > 0){
    editAssetForm.forEach(form =>{
        console.log("kj")

const editResourceID = form.querySelector("#editResourceID")
const editResourceType = form.querySelector("#editResourceType")
form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const editData = {
    EditID :  editResourceID.value,
    EditType: editResourceType.value
    }

fetch(`/editResourceModal/${JSON.stringify(editData)}`, {
    method: "GET",
    // body: JSON.stringify(editData),
    // headers: {
    //     "Content-type" : "application/JSON"
    // }
}).then(res => res.json())
.then(data =>{
    let FormEditResult
    editSection.innerHTML = ""
    if(data.type == "book"){
        FormEditResult = JSON.parse(data.queryResult)
        const bookId = FormEditResult[0].book_id
        const bookTitle = FormEditResult[0].book_title
        const bookYear = FormEditResult[0].book_year
        const NewFormData =`<form method="POST" action="/myAssets/update/book" enctype="application/x-www-form-urlencoded">
        <label class="form-label">Edit Book Title</label>
        <input type="hidden" id="bookId" name="bookId" value="${bookId}" required readonly>
        <input type="text" id="bookTitleEdit" name="bookTitleEdit" class="form-control" value="${bookTitle}" required> <br>
        <label class="form-label">Edit Book Year</label>
        <input type="text" id="bookYearEdit" name="bookYearEdit" class="form-control" value="${bookYear}" required>
        <input type="submit" hidden id="submitForm"/>
    </form>`
    const submitForm = document.getElementById("submitForm")
    updateEditModal(NewFormData)

    }else if(data.type == "publication"){
        FormEditResult = JSON.parse(data.queryResult)
        const publicationID = FormEditResult[0].link_buffer
        const publicationURL =FormEditResult[0].link_href
        const NewFormData1 = `<form method="POST" action="/myAssets/update/publication" enctype="application/x-www-form-urlencoded">
        <input type="hidden" id="publicationID" name="publicationID"  value="${publicationID}" required readonly>
        <label class="form-label">Edit Publication URL</label>
        <input type="url" id="publicationURLEdit"  name="publicationURLEdit" class="form-control" value="${publicationURL}" required> <br>
        <input type="submit" hidden id="submitForm"/>
    </form>`
    const submitForm = document.getElementById("submitForm")
    updateEditModal(NewFormData1)
    }else if(data.type == "podcast"){
        FormEditResult = JSON.parse(data.queryResult)
        
        const podcastId = FormEditResult[0].buffer
        const podcastTitle = FormEditResult[0].podcast_title
        const NewFormData2 = `<form method="POST" action="/myAssets/update/podcast"  enctype="application/x-www-form-urlencoded">
        <input type="hidden" id="podcastId" name="podcastId" value="${podcastId}" required readonly>
        <label class="form-label">Edit Podcast Title</label>
        <input type="text" id="podcastTitleEdit" name="podcastTitleEdit" class="form-control" value="${podcastTitle}" required> <br>
        <input type="submit" hidden id="submitForm"/>
    </form>`

    const submitForm = document.getElementById("submitForm")
    updateEditModal(NewFormData2)
    

    }else if(data.type == "tutorial"){
         FormEditResult = JSON.parse(data.queryResult)
        const tutorialId = FormEditResult[0].tutorial_id
        const tutorialTitle = FormEditResult[0].tutorial_title
        const tutorialDescription = FormEditResult[0].tutorial_description
        const NewFormData3 = `<form method="POST" action="/myAssets/update/tutorials"  enctype="application/x-www-form-urlencoded">
        <input type="hidden" id="tutorialId"  name="tutorialId" value="${tutorialId}" required readonly>
        <label class="form-label">Edit Tutorial Title</label>
        <input type="text" id="tutorialTitleEdit" name="tutorialTitleEdit" class="form-control" value="${tutorialTitle}" required><br>
        <label class="form-label">Edit Tutorial Description</label>
        <textarea name="tutorialDescription" id="tutorialDescriptionEdit" cols="30" rows="10" class="form-control" required>${tutorialDescription}</textarea>
        <input type="submit" hidden id="submitForm"/>
    </form>`
        const submitForm = document.getElementById("submitForm")
    updateEditModal(NewFormData3)
    
    }
})
})
})
}




// FOR THE DELETE FORMS 

if(DeleteAssetForm.length > 0){
    DeleteAssetForm.forEach(formDelete =>{
        console.log("kkkj")
const DeleteResourceID = formDelete.querySelector("#deleteResourceID")
const DeleteResourceType = formDelete.querySelector("#deleteResourceType")
formDelete.addEventListener("submit", (e)=>{
    e.preventDefault();
    const DeleteData = {
    DeleteID :  DeleteResourceID.value,
    DeleteType: DeleteResourceType.value
    }

fetch(`/deleteResourceModal/${JSON.stringify(DeleteData)}`, ()=>{
    method: "GET"
}).then(res => res.json())
.then(data =>{
    let deleteFormResult
    editSection.innerHTML = ""
    if(data.type == "book"){
        deleteFormResult = JSON.parse(data.queryResult)
        const bookTitle = deleteFormResult[0].book_title
        const bookId = deleteFormResult[0].book_id
        const NewFormData =`
        <form method="POST" action="/myAssets/delete/book"  enctype="application/x-www-form-urlencoded">
        <input type="hidden" name="bookIdDelete" id="bookIdDelete" value="${bookId}" readonly>
        <label class="form-label">Are you sure you want to delete this book?</label>
        <input type="text" id="bookTitleDelete" class="form-control" value="${bookTitle}" readonly> <br>
        <input type="submit" id="DeleteForm" hidden>
    </form>`

    updateDeleteModal(NewFormData)

    }else if(data.type == "publication"){
        deleteFormResult = JSON.parse(data.queryResult)
        const publicationURL = deleteFormResult[0].link_href
        const publicationId = deleteFormResult[0].link_buffer
        const NewFormData1 = `<form method="POST" action="/myAssets/delete/publication"  enctype="application/x-www-form-urlencoded">
        <input type="hidden" id="publicationIdDelete" name="publicationIdDelete" value="${publicationId}" readonly/>
        <label class="form-label">Are you sure you want to delete this ?</label>
        <input type="text" id="publicationURLDelete" class="form-control" value="${publicationURL}" readonly> <br>
        <input type="submit" id="DeleteForm" hidden>

    </form>`

    updateDeleteModal(NewFormData1)

    }else if(data.type == "podcast"){
        deleteFormResult = JSON.parse(data.queryResult)
        const podcastTitle = deleteFormResult[0].podcast_title
        const podcastId = deleteFormResult[0].buffer

         const NewFormData2 = `<form  method="POST" action="/myAssets/delete/podcast"  enctype="application/x-www-form-urlencoded">
        <label class="form-label">Are you sure you want to Delete this Podcast ?</label>
        <input type="hidden" id="podcastIdDelete" name="podcastIdDelete" value="${podcastId}" readonly>
        <input type="text" id="podcastTitleDelete" class="form-control" value="${podcastTitle}" readonly> <br>
        <input type="submit" id="DeleteForm" hidden>

    </form>`
    updateDeleteModal(NewFormData2)

    }else if(data.type == "tutorial"){
        deleteFormResult = JSON.parse(data.queryResult)
        const tutorialTitle = deleteFormResult[0].tutorial_title
        const tutorialDescription = deleteFormResult[0].tutorial_description
        const tutorialid = deleteFormResult[0].tutorial_id
        const NewFormData3 = `<form method="POST" action="/myAssets/delete/tutorial"  enctype="application/x-www-form-urlencoded">
        <input type="hidden" id="tutorialDeleteId" name="tutorialDeleteId" value="${tutorialid}" readonly>
        <label class="form-label">Are you sure you want to delete this tutorial ?</label>
        <input type="text" id="tutorialTitleDelete" class="form-control" value="${tutorialTitle}" readonly> <br>
        <input type="submit" id="DeleteForm" hidden>
    </form>`

    updateDeleteModal(NewFormData3)
    }
})
})
})
}
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
    initializeEditForm();
});

window.addEventListener('load', () => {
    console.log('load event fired');
    initializeEditForm();
});




