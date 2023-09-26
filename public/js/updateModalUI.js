const submitModal = document.getElementById("submitModal")
const DeleteModal = document.getElementById("DeleteModal")


submitModal.addEventListener("click", ()=>{
    if(submitForm){
    submitForm.click()
    } 
})

DeleteModal.addEventListener("click", ()=>{
    if(DeleteForm){
    DeleteForm.click()
    } 
})
function updateEditModal(formData){
    editSection.innerHTML = ""
    editSection.innerHTML = formData

}

// DELETE FROM DATA 
function updateDeleteModal(formData){
    deleteSection.innerHTML = ""
    deleteSection.innerHTML = formData
}