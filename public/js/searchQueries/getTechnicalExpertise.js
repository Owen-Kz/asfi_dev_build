// const VisitedUSername = document.getElementById("searchNameUser")
const technical_expertise_container = document.getElementById("technical_expertise_container")


if(VisitedUSername){
    fetch(`/getSkillsOf/${VisitedUSername.value}`, ()=>{
        method:"GET"
    }).then(res => res.json())
    .then(data =>{
        const SkillArray = JSON.parse(data.SkillArray)
        if(SkillArray.length > 0){
            SkillArray.forEach(Skill => {
                const Skill_tite = Skill.skill_name
                technical_expertise_container.innerHTML+=`<li><div class="dot"></div><span>${Skill_tite}</span></li>`
                
            });
        }else{
		
            technical_expertise_container.innerHTML = `<h6 class="uppercase">Nothing to show yet...</h6>`
        }
    })
}

