const mainContainer = document.querySelector(".main-container");
const deleteSpace = document.getElementById("delete_space");

deleteSpace.addEventListener("click", ()=>{
   console.log("Delete Clicked!")
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
           <p>You'll be redirected to the directory.<p>`;
           setTimeout(()=>{
            window.location.href="/directory";
           }, 2000);
            
        } else if(data.error){
          mainContainer.innerHTML = `<span> ${data.error} </span`
        }
       
    })
})