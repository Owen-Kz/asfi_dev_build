
const googleScholar_container = document.getElementById("googleScholar_container")

const personName = document.getElementById("name").value;
fetch(`/findGoogleScholar?name=${encodeURIComponent(personName)}`, ()=>{
    method:"GET"
}).then(res => res.json())
.then(data =>{
    console.log(data)
   })



    //     if (data.error) {
    //       profileDiv.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
    //     } else {
    //       profileDiv.innerHTML = `
    //         <h2>${data.name}</h2>
    //         <p><strong>Publications:</strong> ${data.publications}</p>
    //         <p><strong>Citations:</strong> ${data.citations}</p>
    //       `;
    //     }
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //     profileDiv.innerHTML = `<p style="color: red;">An error occurred. Please try again.</p>`;
    //   }