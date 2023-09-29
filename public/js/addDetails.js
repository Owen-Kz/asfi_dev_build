const addDetailsModals = document.getElementById("addDetailsModals")
const appDetaillabel = document.getElementById("appDetaillabel")
const addWorkHistoryButton = document.getElementById("addWorkHistoryButton")
const addTechnicalExpButton = document.getElementById("addTechnicalExpButton")
const addAwardButton = document.getElementById("addAwardButton")
const submitDetailsModal = document.getElementById("submitDetailsModal")

const WorkHistoryForm = `<form id="create_work_form">
<label class="form-label">Enter Position</label>
<input type="text" class="form-control" id="work_history_name" name="work_history_name" placeholder="What position did you hold ?" required>
<label class="form-label">Enter organization</label>
<input type="text" class="form-control" id="work_organization" name="work_organization" placeholder="What organization did you work for ?" required>
<label class="form-label">Enter Start Year</label>
<input type="number" class="form-control" id="start_year" name="start_year" placeholder="Enter the year you started" required>
<label class="form-label">Enter End Year</label>
<input type="text" class="form-control" id="end_year" name="end_year" placeholder="Enter (Currently work here) if you still work here" required>
<input type="submit" id="submitWorkForm" hidden>
</form>`

const TechnicalExpertiseForm = `<form id="create_Skill_form">
<label class="form-label">Enter Technical Expertise</label>
<input type="text" class="form-control" id="skill_name" name="skill_name" placeholder="Write Skill here" required>

<input type="submit" id="submitSkillForm" hidden>
</form>`

const AwardForm = `<form id="create_award_form">
<label class="form-label">Enter Award Title</label>
<input type="text" class="form-control" id="award_title" name="award_title" placeholder="Award For" required>
<label class="form-label">Enter Awarded By</label>
<input type="text" class="form-control" id="awarded_by" name="awarded_by" placeholder="Awarded By" required>

<input type="submit" id="submitAwardForm" hidden>
</form>`

if(addWorkHistoryButton){
    addWorkHistoryButton.addEventListener("click", function(){
        addDetailsModals.innerHTML = ""
        appDetaillabel.innerText = "Add Work History"
        addDetailsModals.innerHTML = WorkHistoryForm

        const create_work_form = document.getElementById("create_work_form")
        const work_organization = document.getElementById("work_organization")
        const work_history_name = document.getElementById("work_history_name")
        const start_year = document.getElementById("start_year")
        const end_year = document.getElementById("end_year")
        const submitWorkForm = document.getElementById("submitWorkForm")
        // Submit Work History 
    if(create_work_form){
    create_work_form.addEventListener("submit", function(e){
        e.preventDefault()
        const newFormdata = {
            work_history_name:work_history_name.value,
            work_organization: work_organization.value,
            start_year: start_year.value,
            end_year: end_year.value
        } 
        fetch("/createworkHistory", {
            method: "POST",
            body: JSON.stringify(newFormdata),
            headers: {
                "Content-type" : "application/JSON",
            }
        }).then(res => res.json())
        .then(data =>{
            alert(data.message)            
        })
    })
    submitDetailsModal.addEventListener("click", function(){
        submitWorkForm.click()
    })
    }
    
    })
   
}


if(addTechnicalExpButton){
    addTechnicalExpButton.addEventListener("click", function(){
        addDetailsModals.innerHTML = ""
        appDetaillabel.innerText = "Add a skill"

        addDetailsModals.innerHTML = TechnicalExpertiseForm

        const create_Skill_form = document.getElementById("create_Skill_form")
        const Skill_name = document.getElementById("skill_name")
        const submitSkillForm = document.getElementById("submitSkillForm")

    if(create_Skill_form){
        create_Skill_form.addEventListener("submit", function(e){
            e.preventDefault()
            const newFormdata = {
                skill_name:Skill_name.value,
            } 
            fetch("/createSkill", {
                method: "POST",
                body: JSON.stringify(newFormdata),
                headers: {
                    "Content-type" : "application/JSON",
                }
            }).then(res => res.json())
            .then(data =>{
                alert(data.message)
                
            })
        })
        submitDetailsModal.addEventListener("click", function(){
            submitSkillForm.click()
        })
    }
    })
}


if(addAwardButton){
    addAwardButton.addEventListener("click", function(){
        addDetailsModals.innerHTML = ""
        appDetaillabel.innerText = "Add an Award you earned"
        addDetailsModals.innerHTML = AwardForm

        const create_award_form = document.getElementById("create_award_form")
        const award_title = document.getElementById("award_title")
        const awarded_by = document.getElementById("awarded_by")
        const submitAwardForm = document.getElementById("submitAwardForm")
     
    if(create_award_form){
        create_award_form.addEventListener("submit", function(e){
            e.preventDefault()
            const newFormdata = {
                awarded_by:awarded_by.value,
                award_title: award_title.value,
            } 
            fetch("/createAward", {
                method: "POST",
                body: JSON.stringify(newFormdata),
                headers: {
                    "Content-type" : "application/JSON",
                }
            }).then(res => res.json())
            .then(data =>{
                alert(data.message)
                
            })
        })
        submitDetailsModal.addEventListener("click", function(){
            submitAwardForm.click()
        })
    }
    })
}