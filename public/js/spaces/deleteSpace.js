const mainContainer = document.querySelector(".main-container");
const deleteBtn = document.getElementById('delete_space');
    const modal = document.getElementById('deleteModal');
    const closeModal = document.getElementById('closeModal');
    const cancelDelete = document.getElementById('cancelDelete');
    const confirmDelete = document.getElementById('confirmDelete');




    

    // Show modal when the delete button is clicked
    deleteBtn.addEventListener('click', () => {
      modal.style.display = 'block';
    });

    // Close modal when the "x" button is clicked
    closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    // Close modal when "No" is clicked
    cancelDelete.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    // Confirm delete action when "Yes" is clicked
    confirmDelete.addEventListener('click', () => {
      // Placeholder action for deletion (replace with actual delete logic)
      fetch(`/deleteSpace/${spaceID.value}`, {
        method: "POST",
        headers:{
             "Content-type" : "application/JSON"
        }
    }).then(res => res.json())
    .then(data => {
        console.log(data)
        if(!data){
      mainContainer.innerHTML = `<span>Internal Server Error!</span>`
        }else if(data.success){
           mainContainer.innerHTML = `<span class="successMessage">You've successfully deleted your Space!</span>
           <p>You'll be redirected in shortly.<p>`;
           setTimeout(()=>{
            window.location.href="/Spaces";
           }, 2000);
            
        } else if(data.error){
          mainContainer.innerHTML = `<span> ${data.error} </span`
        }
       
    })
      modal.style.display = 'none';
    });

    // Close the modal if user clicks outside of the modal-content
    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });