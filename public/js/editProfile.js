setToReadOnly()


const addMoreButton = document.querySelector(".add-more");
const inputFieldsContainer = document.querySelector(".inputFieldContainer");
const profileEdit = document.querySelector("#profile-edit");
const linksEdit = document.querySelector('#links-edit');
const emailEdit = document.querySelector('#email-edit');
const passwordEdit = document.querySelector('#password-edit');

// Add an event listener to the "Add More" button
addMoreButton.addEventListener('click', () => {
    const inputSet = document.createElement('div');
    const inputField1 = document.createElement('input');
    inputField1.setAttribute('class','form-control mb-2');
    inputField1.type = 'text';
    inputField1.name = 'honoraryName[]';
    inputField1.placeholder = 'Enter Degree';
    const inputField2 = document.createElement('input');
    inputField2.setAttribute('class','form-control mb-2');
    inputField2.type = 'text';
    inputField2.name = 'honoraryText[]';
    inputField2.placeholder = 'Enter Description: i.e (Attained from Winsconsin University)';
    const lineDivider = document.createElement('hr');
    inputSet.appendChild(inputField1);
    inputSet.appendChild(inputField2);
    inputSet.appendChild(lineDivider);
    inputFieldsContainer.appendChild(inputSet);
});




function setToReadOnly(){
    const inputFields1 = form1.querySelectorAll('.form-control');
    const inputFields2 = form2.querySelectorAll('.form-control');
    const inputFields3 = form3.querySelectorAll('.form-control');
    const inputFields4 = form4.querySelectorAll('.form-control');
    const dropDownCountries = document.getElementById("newLocation")
inputFields1.forEach(field => {
field.setAttribute('readonly','true');   
});
inputFields2.forEach(field => {
    field.setAttribute('readonly','true');   
    });
inputFields3.forEach(field => {
    field.setAttribute('readonly','true');   
    });
inputFields4.forEach(field => {
    field.setAttribute('readonly','true');   
    });
    dropDownCountries.setAttribute('disabled', 'true')
}


// const mainSaveChanges = document.getElementById("mainSaveChanges")
// // const from1  = document.getElementById("form1")
// mainSaveChanges.addEventListener("click", () =>{
//     form1.submit()
// })

profileEdit.addEventListener('click', () => {
    const inputFields1 = form1.querySelectorAll('.form-control');
    mainSaveChanges.removeAttribute("disabled")
    addMoreButton.removeAttribute("disabled")
    inputFields1.forEach(field => {
        field.removeAttribute('readonly');
    })
    const dropDownCountries = document.getElementById("newLocation")
    dropDownCountries.removeAttribute("disabled")

});

linksEdit.addEventListener('click', () => {
    const inputFields2 = form2.querySelectorAll('.form-control');
    
    inputFields2.forEach(field => {
    linkSubmit.removeAttribute("disabled")
        field.removeAttribute('readonly');
        field.setAttribute("type", "url")
        field.removeAttribute("hidden")
    })
});

emailEdit.addEventListener('click', () => {
    const inputFields3 = form3.querySelectorAll('.form-control');
    updateEmail.removeAttribute("disabled")
    inputFields3.forEach(field => {
        field.removeAttribute('readonly');
    })
});

passwordEdit.addEventListener('click', () => {
    const inputFields4 = form4.querySelectorAll('.form-control');
    submitPassword.removeAttribute("disabled")
    inputFields4.forEach(field => {
        field.removeAttribute('readonly');
    })
});
// ... (rest of the JavaScript) ...