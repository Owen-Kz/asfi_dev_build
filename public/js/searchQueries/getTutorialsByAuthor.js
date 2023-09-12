const tutorialOwnerContainer = document.getElementById("tutorialOwnerContainer").value
const tutorialsByAuthorContainerMain = document.getElementById("tutorialsByAuthorContainerMain")
const tutoialsOfSameCourse = document.getElementById("tutorialsInCategory")
const tutorialCategory = document.getElementById("tutorialCategory").value


fetch(`/${tutorialOwnerContainer}/tutorialsByAuthor`, ()=> {
    method:"GET"
}).then(res => res.json())
.then(data =>{
    if(data.TutorialsByAuthorData.length > 0){
      const TutorialsByAuthorArray =   document.getElementById("tutorialsByAuthor")

      TutorialsByAuthorArray.setAttribute("value", data.TutorialsByAuthorData)
    }else{
    tutorialsByAuthorContainerMain.innerHTML = `<h5 class="mb-4">There are no more courses from this author</h5>
    `;
      TutorialsByAuthorArray.value = []

    }
})


// get Tutorials of the same Category 
fetch(`/${tutorialOwnerContainer}/${tutorialCategory}/tutorialsSameCourse`, ()=> {
    method:"GET"
}).then(res => res.json())
.then(data =>{
    if(JSON.parse(data.TutorialsSameCourseData).length > 0){

   

    tutoialsOfSameCourse.setAttribute("value", data.TutorialsSameCourseData)
    }else{
    // tutorialsByAuthorContainerMain.innerHTML = `<h5 class="mb-4">There are no more courses from this author</h5>`;
    tutoialsOfSameCourse.setAttribute("value", "[]")


    }
})
    
