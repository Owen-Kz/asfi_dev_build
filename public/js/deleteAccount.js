document.addEventListener("DOMContentLoaded", function () {
    const deleteAccountForm = document.getElementById("deleteAccount");
    const deleteAccountCheck = document.getElementById("deleteaccountCheck");
    const deleteAccountButton = document.getElementById("deleteAccountButton");
  
    // Add an event listener to the checkbox
    deleteAccountButton.setAttribute("disabled", "true");
    
    deleteAccountCheck.addEventListener("change", function () {
      if (deleteAccountCheck.checked) {
        // Enable the delete button when the checkbox is checked
        deleteAccountButton.removeAttribute("disabled");
      } else {
        // Disable the delete button when the checkbox is unchecked
        deleteAccountButton.setAttribute("disabled", "true");
      }
    });
  
  });


