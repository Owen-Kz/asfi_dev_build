const createAdminForm = document.getElementById("createAdminForm")
const newAdminSubmit = document.getElementById("newAdminSubmit")
const submitAdminButton = document.getElementById("submitAdminButton")
const errorMessgeContainer = doucment.getElementById("errorMessgeContainer")

submitAdminButton.addEventListener("click", function(){
    ValidateForm()
})

async function ValidateForm(){
    let ErrorRate = 0
    if(firstName.value == "" || userName.value == "" || lastName.value == "" || email.value == ""){
        errorMessgeContainer.innerHTML += `<li>please Fill all fields</li>`
        ErrorRate++
    }
    if(inputPassword5.value != inputPassword6.value){
        errorMessgeContainer.innerHTML += `<li>Passwords do not match!</li>`
        ErrorRate++
    }
    if(inputPassword5.length < 8){
        errorMessgeContainer.innerHTML += `<li>Password must be at least 8 Characters Long</li>`
        ErrorRate++
    }
   const Response  = `${ErrorRate = 0 ? "success" : "error"}`

    return Response
}

async function VerifyAndSubmitForm(){
    const FormValidation = await ValidateForm()
    if(FormValidation == "success"){
        errorMessgeContainer.innerHTML = ""
        SubmitForm()
    }
}


function SubmitForm(){
    newAdminSubmit.click()
}

function SendFormData(){
    
    createAdminForm.addEventListener("submit", function(){
        const FormData = {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            password: password.value
        }
        fetch("/adminstrator/create/new/secured", {
            method:"POST",
            body: JSON.stringify(FormData)
        }).then(res => res.json())
        .then(data =>{
            if(data.message == "accountCreated"){
                alert("Account Created Successfully, Credentials has been sent Via Email")
            }else{
                alert("Internal Server Error: Could not Create Account")
            }
        })
    })
}