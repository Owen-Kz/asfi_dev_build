const block_modal = document.getElementById("block_modal")

function UpdateBlockModal(fullname, email, userId){

        block_modal.innerHTML = `
        <form id='bloack_scholar_form'>
        <!-- Name -->
        <input type='hidden' id='user_id' value="${userId}" readonly/>
        <span class="small">Instructor Name:</span>
        <h6 class="mb-3">${fullname}</h6>
        <!-- Email -->
        <span class="small">Instructor Email id:</span>
        <h6 class="mb-3">${email}</h6>

        <!-- Summary -->
        <span class="small">NOTE:</span>
        <p class="text-dark mb-2">Completing this process will block this Instructor from the ASFIScholar platform, ADMIN can unblock later.</p>
        <button type="submit" class="btn btn-danger-soft my-0">Block</button>
        </form>
        </div>

        <!-- Modal footer -->
        <div class="modal-footer">
        <button type="button" class="btn btn-danger-soft my-0" data-bs-dismiss="modal">Close</button>
        </div>`
}