const degrees_container = document.getElementById("degrees_container")
const usernameValidator = document.getElementById("usernameValidator").value

fetch(`/getDegrees/${usernameValidator}`, ()=>{
    method: "GET"
}).then(res => res.json())
.then(data =>{

    const AllDegrees = JSON.parse(data.AllDegrees)
    if(AllDegrees.length > 0){
        AllDegrees.forEach(degree => {
            const DegreeTitle = degree.honorary_type
            const DegreeSubtext  = degree.additional_info
        degrees_container.innerHTML += `<div class="degree">
        <div class="degree_title">
        <b>${DegreeTitle}</b>
        </div>
        <div class="degree_subtext">
            ${DegreeSubtext}
        </div>
        </div>`;
        });
    }

})
