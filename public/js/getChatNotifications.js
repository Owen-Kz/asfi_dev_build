const Chat_id_container = document.getElementById("Chat_id_container");
const chatsCounter = document.getElementById("chats-counter");

fetch("/getMessageNotifications", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    }
})
.then(res => res.json())
.then(data => {


    // Clear previous notifications before adding new ones
    Chat_id_container.innerHTML = "";

    if (data.notifications.length > 0) {
        // Update the counter to show the number of new notifications
        chatsCounter.textContent = data.notifications.length;

        const notificationArray = data.notifications;

        notificationArray.forEach(Notification => {
            const notificationElement = document.createElement("div");
            notificationElement.classList.add("notification");

            notificationElement.innerHTML = `
                <div class="icon">
                    <img src="${Notification.sender_image}" alt="notification_image">
                </div>
                <div class="notification_body">
                    <a href="${Notification.end_point}">
                        <div class="title">${Notification.content}:</div>
                    </a>
                    <div class="timestamp">${formatTime(Notification.date_sent)}</div>
                </div>
            `;

            Chat_id_container.appendChild(notificationElement);
        });
    } else {
        // No new notifications, reset the counter and display a message
        chatsCounter.textContent = "0";
        Chat_id_container.innerHTML = `<li class='no-notification'>No new Messages to display</li>`;
    }
})
.catch(error => console.error("Error fetching notifications:", error));
