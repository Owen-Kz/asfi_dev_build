let title = document.querySelectorAll(".chat-list-header");
let totalHeight = 0;

for (let i = 0; i < title.length; i++) {
  let totalHeight = 0;
  title[i].addEventListener("click", function () {
    let result = this.nextElementSibling;
    let activeSibling = this.nextElementSibling.classList.contains('active');
    this.classList.toggle('active');
    result.classList.toggle("active");
    if (!activeSibling) {
      for (i = 0; i < result.children.length; i++) {
        totalHeight = totalHeight + result.children[i].scrollHeight + 40;
      }
    } else {
      totalHeight = 0;
    }
    result.style.maxHeight = totalHeight + "px";
  });
}


const themeColors = document.querySelectorAll('.theme-color');
let selectedTheme = localStorage.getItem("selectedTheme");

// Function to set the theme color
function setThemeColor(theme) {
    document.body.setAttribute('data-theme', theme);
    selectedTheme = theme;
    // Save the selected theme color to Local Storage
    localStorage.setItem("selectedTheme", theme);
}

// Initialize the theme color based on the stored value
if (selectedTheme) {
    setThemeColor(selectedTheme);
} else {
    // Default theme color (if none is saved)
    selectedTheme = "default"; // Change this to your default theme color
    setThemeColor(selectedTheme);
}

themeColors.forEach(themeColor => {
    const theme = themeColor.getAttribute('data-color');

    themeColor.addEventListener('click', e => {
        themeColors.forEach(c => c.classList.remove('active'));
        themeColor.classList.add('active');
        setThemeColor(theme);
    });
});

const appLeft = document.querySelector(".app-left");
const toggleButton = document.getElementById("bar-btn");

// Function to toggle the left container
function toggleLeftContainer() {
  appLeft.classList.toggle("slide-over");
}

// Toggle left container on button click
toggleButton.addEventListener("click", toggleLeftContainer);

// Toggle left container when clicking outside of it
document.addEventListener("click", function (event) {
  if (!appLeft.contains(event.target) && !toggleButton.contains(event.target)) {
    appLeft.classList.remove("slide-over");
  }
});