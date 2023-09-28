const VisitedUSername = document.getElementById("searchNameUser")
const WorkHistoryContainer = document.getElementById("WorkHistoryContainer")


if(VisitedUSername){
    fetch(`/getWorkHistoryOf/${VisitedUSername.value}`, ()=>{
        method:"GET"
    }).then(res => res.json())
    .then(data =>{
        const WorkArray = JSON.parse(data.workArray)
        if(WorkArray.length > 0){
            WorkArray.forEach(work => {
                const work_tite = work.work_history_name
                const work_postion = work.work_organization
                const start_year = work.start_year
                const end_year = work.end_year

                WorkHistoryContainer.innerHTML+=`<div class="d-flex align-items-center mb-4">
                <span class="icon-md mb-0 bg-light rounded-3"><i class="fas"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M480 288c0-80.25-49.28-148.92-119.19-177.62L320 192V80a16 16 0 0 0-16-16h-96a16 16 0 0 0-16 16v112l-40.81-81.62C81.28 139.08 32 207.75 32 288v64h448zm16 96H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h480a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z"/></svg></i></span>
                <div class="ms-3">
                    <h6 class="mb-0">${work_tite}</h6>
                    <p class="mb-0 small">${work_postion}</p>
                    <p class="mb-0 small"><i>From ${start_year} to ${end_year}</i></p>
                </div>
            </div>`
                
            });
        }else{
		
            WorkHistoryContainer.innerHTML = `<h6 class="uppercase">Nothing to show yet...</h6>`
        }
    })
}

