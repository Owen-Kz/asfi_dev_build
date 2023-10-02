// COnvert Video Duration to minutes 
  function ConvertToMinutes(secondsProvided){
    // Define the total seconds
var totalSeconds = secondsProvided;

// Calculate hours, minutes, and seconds
var hours = Math.floor(totalSeconds / 3600);
var minutes = Math.floor((totalSeconds % 3600) / 60);
var seconds = Math.round(totalSeconds % 60); 

// Create strings with appropriate prefixes
var hoursStr = hours > 0 ? hours + "h" + (hours > 1 ? "" : "") : "";
var minutesStr = minutes > 0 ? minutes + "m" + (minutes > 1 ? "" : "") : "";
var secondsStr = seconds > 0 ? seconds + "s" + (seconds > 1 ? "" : "") : "";

// Combine the time components
const result = [hoursStr, minutesStr, secondsStr].filter(Boolean).join(" ");
return result
}

  function formatDateAgo(dateString) {
    const inputDate = new Date(dateString); // Parse the input date string
    const currentDate = new Date(); // Get the current date

    // Calculate the time difference in milliseconds
    const timeDifference = currentDate - inputDate;
  
    // Calculate the number of days ago
    const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  
    if (daysAgo === 0) {
      return "Today";
    } else if (daysAgo === 1) {
      return "Yesterday";
    } else if(daysAgo > 365){
        return "1 year ago"
    }
    else {
      return daysAgo + " Days Ago";
    }
  }
// module. s = { ConvertToMinutes }