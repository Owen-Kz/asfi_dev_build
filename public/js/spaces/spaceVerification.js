space_verification.addEventListener("submit", (e)=>{
    e.preventDefault();
    const NewSpaceData = {
   spaceKey:spaceKey.value,
   space_id:space_id.value
      // thumbnail: thumbnail.files[0]
    }
   
    fetch("/validateSpaceKey", {
      method:"POST",
      body: JSON.stringify(NewSpaceData),
      headers:{
        "Content-type" : "application/JSON"
      }
    }).then(res => res.json())
    .then(data => {
     console.log(data)
     if(data.success){

        window.location.reload()
     } else if (data.error){
      const errorMessage = document.querySelector(".errorMessage");
      
      errorMessage.innerText = `${data.error}`
     }
      } )
     
})

const spaceKeyMain = document.getElementById("spaceKey")

spaceKeyMain.addEventListener("keyup", ()=>{
   if (spaceKeyMain.value.length === 3){
    spaceKeyMain.value += "-"
    spaceKeyMain.style.border = "1px solid green";
   }
   if(spaceKeyMain.value.length === 7){
    submitVerify.click()
   }
})


spaceKeyMain.addEventListener("change", ()=>{
    
   if (spaceKeyMain.value.length > 7){
    spaceKeyMain.value = spaceKeyMain.value.slice(0, 3) + "-" + spaceKeyMain.value.slice(3, 7)
    submitVerify.click()
    spaceKeyMain.style.border = "1px solid green";
   }

})


