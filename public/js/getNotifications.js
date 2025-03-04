// console.log("Notifications")
const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time; // Difference in milliseconds
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
        return "just now";
    } else if (diffMinutes < 60) {
        return `${diffMinutes} min${diffMinutes > 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
    } else if (diffDays < 7) {
        return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else {
        // When it's more than 7 days, return the formatted date
        const options = { year: "numeric", month: "short", day: "numeric" };
        return time.toLocaleDateString(undefined, options); // Adjusts to local timezone and format
    }
};



const  Notification_id_container = document.getElementById("Notification_id_container");
const usernameContainer = document.getElementById("usernameContainer").value;
const notifyCounter = document.getElementById("notify-counter");
fetch("/getAllNotifications", ()=>{
    method:"GET"
})
.then(res => res.json())
.then(data =>{
    if(data.NotificationData.length > 0){
        const NotificationArray = data.NotificationData
          // Update the counter to show the number of new notifications
          notifyCounter.textContent = data.NotificationData.length;


        for(let i=0; i<NotificationArray.length; i++){
            const Notification = NotificationArray[i]
    
            Notification_id_container.innerHTML +=`<!-- Single notification item  -->
      <div class="notification">
        <div class="icon">
            <img src="${Notification.sender_image}" alt="notification_image">
        </div>

        <!-- Start notification Main body to the right  -->
         
         <div class="notification_body">
           <a href="${Notification.end_point}"> <div class="title">
            ${Notification.content}:</div>
            </a>
            <div class="timestamp">${formatTime(Notification.date_sent)}</div>
         </div>
    
       
    </div>
    <!-- End single notification item  -->`;
        }
    }else{
        // No new notifications, reset the counter and display a message
        notifyCounter.textContent = "0";
        Notification_id_container.innerHTML +=`<li class='no-notification'>No new Notifications to display</li>`;

    }

})

// JavaScript code to toggle chat_container visibility
const chatContainer = document.querySelector('.chat_container');
const toggleChatButton = document.getElementById('toggleChatButton');

toggleChatButton.addEventListener('click', () => {
    // Toggle the visibility of chat_container
    chatContainer.style.display = chatContainer.style.display === 'block' ? 'none' : 'block';
});