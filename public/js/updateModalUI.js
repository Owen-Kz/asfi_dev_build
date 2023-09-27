const submitModal = document.getElementById("submitModal")
const DeleteModal = document.getElementById("DeleteModal")


if(submitModal){
submitModal.addEventListener("click", ()=>{
    if(submitForm){
    submitForm.click()
    } 
})
}

if(DeleteModal){
DeleteModal.addEventListener("click", ()=>{
    if(DeleteForm){
    DeleteForm.click()
    } 
})
}
function updateEditModal(formData){
    editSection.innerHTML = ""
    editSection.innerHTML = formData

}

// DELETE FROM DATA 
function updateDeleteModal(formData){
    deleteSection.innerHTML = ""
    deleteSection.innerHTML = formData
}


// Instructor Course FORM DATA
function updateCourseEditModal(formData){
    editSection.innerHTML = ""
    editSection.innerHTML = formData

    const submitEdit = document.getElementById("submitEdit")
    const sumitModalEdit = document.getElementById("sumitModalEdit")

    sumitModalEdit.addEventListener("click", function(){
        submitEdit.click()
    })
}


// DELETE FORM DATA 
function updateCourseDeleteModal(formData){
    deleteSection.innerHTML = ""
    deleteSection.innerHTML = formData

}