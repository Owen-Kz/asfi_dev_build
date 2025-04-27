const fileInput = document.getElementById('edit_thumbnail');
const previewImage = document.getElementById('previewImage');
const saveButton = document.getElementById('saveButton');
const cancelButton = document.getElementById('cancelButton');
const form = document.getElementById('thumbnailForm');
const actionButtons = document.getElementById("actionButtons");
const previousImage = document.getElementById("previousImage");

let selectedFile = null;

// Toast function with fade-out
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '30px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.backgroundColor = type === 'error' ? '#e74c3c' : '#2ecc71';
  toast.style.color = '#fff';
  toast.style.padding = '10px 20px';
  toast.style.borderRadius = '8px';
  toast.style.zIndex = 9999;
  toast.style.fontSize = '16px';
  toast.style.boxShadow = '0px 2px 6px rgba(0,0,0,0.3)';
  toast.style.opacity = '1';
  toast.style.transition = 'opacity 0.5s ease';
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
    }, 500); // match transition time
  }, 3000);
}

// Handle file input change
fileInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      showToast('Invalid file type! Only PNG and JPG are allowed.', 'error');
      form.reset();
      previewImage.style.display = 'none';
      actionButtons.style.display = 'none';
      selectedFile = null;
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB size limit
      showToast('File is too large! Maximum allowed size is 5MB.', 'error');
      form.reset();
      previewImage.style.display = 'none';
      actionButtons.style.display = 'none';
      selectedFile = null;
      return;
    }

    selectedFile = file;
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImage.src = e.target.result;
      previewImage.style.display = 'block';
      previousImage.style.display = 'none';
    }
    reader.readAsDataURL(file);
    actionButtons.style.display = 'flex';
  }
});

// Handle Save button click
saveButton.addEventListener('click', function () {
  if (!selectedFile) {
    showToast('Please select a file first!', 'error');
    return;
  }

  // Disable buttons and show loader
  saveButton.disabled = true;
  cancelButton.disabled = true;
  const originalSaveText = saveButton.innerHTML;
  saveButton.innerHTML = `<div class="loader" style="display:inline-block;width:20px;height:20px;border:3px solid #fff;border-top:3px solid #3498db;border-radius:50%;animation:spin 1s linear infinite;"></div>`;

  const spaceId = document.getElementById('space_id').value;
  const formData = new FormData();
  formData.append('editThumbnail', selectedFile);
  formData.append('space_id', spaceId);

  fetch('/editSpaceCoverPhoto', {
    method: 'POST',
    body: formData,
  })
  .then(async (response) => {
    const res = await response.json();
    if (response.ok) {
      showToast('Thumbnail uploaded successfully!');
      previousImage.src = URL.createObjectURL(selectedFile);
      form.reset();
      previewImage.style.display = 'none';
      previousImage.style.display = 'block';
      actionButtons.style.display = 'none';
      selectedFile = null;
    } else {
      const errorMsg = res.message || 'Upload failed.';
      showToast(errorMsg, 'error');
    }
  })
  .catch(error => {
    console.error('Error uploading:', error);
    showToast('An error occurred.', 'error');
  })
  .finally(() => {
    // Re-enable buttons and restore Save button text
    saveButton.disabled = false;
    cancelButton.disabled = false;
    saveButton.innerHTML = originalSaveText;
  });
});

// Handle Cancel button click
cancelButton.addEventListener('click', function () {
  form.reset();
  previewImage.style.display = 'none';
  previousImage.style.display = 'block';
  actionButtons.style.display = 'none';
  selectedFile = null;
});

// Loader animation CSS (needs to be added dynamically or in your CSS)
const style = document.createElement('style');
style.innerHTML = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);
