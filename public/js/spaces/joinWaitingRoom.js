const spaceID = document.getElementById("space_id");
const verifyContainer = document.querySelector(".columnster");

join_request.addEventListener("click", ()=>{
   
    fetch("/joinSpaceRoom", {
        method: "POST",
        body: JSON.stringify({space_id: spaceID.value}),
        headers:{
             "Content-type" : "application/JSON"
        }
    }).then(res => res.json())
    .then(data => {
        console.log(data)
        if(!data){
      verifyContainer.innerHTML = `<span>Internal Server Error!</span>`
        }else if(data.success){
           verifyContainer.innerHTML = `<span class="successMessage">You've been successfully added to the waiting room!</span>
           <p>You'll be redirected to the directory.<p>`;
           setTimeout(()=>{
            window.location.href="/directory";
           }, 3000);
            
        } else if(data.error){
          verifyContainer.innerHTML = `<span> ${data.error} </span`
        }
       
    })
})