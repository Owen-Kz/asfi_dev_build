const itemsContainer = document.getElementById("multiCollapseExample1")

fetch("/getAllCourseCategories", ()=>{
    method: "GET"
}).then(res => res.json())
.then(data => {
    const CategoryItemArray = data.CourseCategoryArray

    CategoryItemArray.forEach(courseItem => {
        const CategoryName = courseItem.category_title

        // Create the HTML for the input field
        const newDiv = document.createElement("div");
        newDiv.classList.add("d-flex", "justify-content-between", "align-items-center");
        newDiv.innerHTML = `<div class="form-check">
                <input class="form-check-input" type="checkbox" value="${CategoryName}" name="category_filter" id="${CategoryName}" hidden>
                <label class="form-check-label check-form-filter" for="${CategoryName}">${CategoryName}</label>
            </div>`;

        // Append the newly created input field to the itemsContainer
        itemsContainer.appendChild(newDiv);

        // Add a click event listener to each input field
        const input = newDiv.querySelector(".form-check-input");
        input.addEventListener("click", () => {

            const inputValue = input.value
            
            // if(input.checked){
            
            fetch(`/filterCategory/${inputValue}`, ()=>{
                method: "GET"
            }).then(res => res.json())
            .then(data => {
                const CourseInCategoryArray = JSON.parse(data.CourseInCategoryArray)
                    updateUIFilter(CourseInCategoryArray)
            })
        // }

        });
    });
});

const filterAsTutorial = document.getElementById("typeTutorial")
const filterAsCourse = document.getElementById("typeCourse")

filterAsTutorial.addEventListener("click", function(){
    fetch("/getAllAsTutorials", ()=>{
        method:"GET"
    }).then(res => res.json())
    .then(data=> {
        const AstutorialsArray = JSON.parse(data.AstutorialsArray)
            updateUIFilter(AstutorialsArray)               
    })
})
        
filterAsCourse.addEventListener("click", function(){
    fetch(`/getAllAsCourses`, ()=>{
        method:"GET"
    }).then(res => res.json())
    .then(data=> {
        const AsCoursesArray = JSON.parse(data.AsCoursesArray)
            updateUIFilter(AsCoursesArray)               
    })
})


const levels_container = document.getElementById("levels_container")
const getLevelsButton = levels_container.querySelectorAll(".levels_filter_button")

getLevelsButton.forEach(button =>{

button.addEventListener("click", ()=>{
    const level = button.value
    // alert(level)

    fetch(`/getAllAsLevels/${level}`, ()=>{
        method:"GET"
        
    }).then(res => res.json())
    .then(data=> {
        const AsLevelsArray = JSON.parse(data.AsLevelArray)
        console.log(AsLevelsArray)
        updateUIFilter(AsLevelsArray)
    })
})    

})





// PAGINATION SCRIPTS 
const ITEMS_PER_PAGE_Tutorials = 3;  
// Initialize the current page numbers
let currentPageTutorials = 1;

 // Function to update the Tutorial list based on the current page
 function updateTutorialsList(page) {
    // Make an AJAX request to your server to fetch Tutorials for the specified page
    fetch(`/tutorials?pageTutorials=${page}`)
      .then(response => response.json())
      .then(data => {
        // Render the Tutorial list based on the data received from the server
        const AllData = JSON.parse(data.AllTutorialsData)
        updateUIFilter(AllData)
        currentPageTutorials = page; // Update the current page number
        updateTutorialPaginationButtons();
      })
      .catch(error => {
        console.error(error);
      });
  }


function updateTutorialPaginationButtons() {
    let prevButton
    if(prevButton = document.getElementById("prevTutorialPage")){
    prevButton = document.getElementById("prevTutorialPage");
    const nextButton = document.getElementById("nextTutorialPage");
    prevButton.disabled = currentPageTutorials === 1;
    nextButton.disabled = currentPageTutorials * ITEMS_PER_PAGE_Tutorials >= TutorialCount;
    }
  }


