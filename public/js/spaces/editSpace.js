const spaceBTN = document.querySelector("#space_edit");
const settingsForm = document.getElementById("settingsForm")
const inputFields = settingsForm.querySelectorAll("input")
const submitForm = settingsForm.querySelector("#submitForm")
const textArea = settingsForm.querySelector("textarea")

spaceBTN.addEventListener("click", () =>{
    inputFields.forEach(field =>{
        if(field.hasAttribute("readonly")){
        field.removeAttribute("readonly")
        }else{
            field.setAttribute("readonly", true)
        }
    })
    if(submitForm.hasAttribute("disabled")){
        submitForm.removeAttribute("disabled")
    }else{
        submitForm.setAttribute("disabled", true)
    }
    if(textArea.hasAttribute("disabled")){
        textArea.removeAttribute("disabled")
    }else{
        textArea.setAttribute("disabled", true)
    }

})


settingsForm.addEventListener("submit", (e) =>{
e.preventDefault()
const spaceTItle = document.getElementById("space_title")
const spaceDescriptpin = document.getElementById("space_description")
const yesM = document.getElementById("yes")
const noM = document.getElementById("no")

let makePrivate = ""

if(yesM.checked){
    makePrivate = "yes"
}else{
    makePrivate = "no"
}
const formData ={
    space_title: spaceTItle.value,
    space_description: spaceDescriptpin.value,
    makePrivate: makePrivate.value,
    space_id: spaceID.value,
}



fetch(`/updateSpaceSettings`, {
    method:"POST",
    body:JSON.stringify(formData),
    headers:{
        "Content-type" : "application/JSON"
    }
}).then(res => res.json())
.then(data =>{
    console.log(data)
    if(data.success){
        alert(data.success)
    }else{
        alert(data.error)
    }
})
})



