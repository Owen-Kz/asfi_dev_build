const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return "just now";
    else if (diffMinutes < 60) return `${diffMinutes} min${diffMinutes > 1 ? "s" : ""} ago`;
    else if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
    else if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    else return time.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

const Notification_id_container = document.getElementById("Notification_id_container");
// let usernameContainerM = document.getElementById("usernameContainer").value;
const notifyCounter = document.getElementById("notify-counter");
const notificationIcon = document.getElementById("notifications");

async function getNotificationsCount() {
    return fetch("/countNotifcations", {
        method: "POST",
        headers: { "Content-type": "application/json" }
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            return { notifications: data.notifications_count, messages: data.message_count };
        } else {
            console.error(data.error);
            return { notifications: 0, messages: 0 };
        }
    });
}

let notificationsCount = 0;

async function createNotificationsCount() {
    notificationsCount = await getNotificationsCount(); // this sets it as an object
    return notificationsCount;
}

// ✅ Wrap everything in an async IIFE
// Inside your existing async IIFE
(async () => {
    const counts = await createNotificationsCount();
    const messageCount = counts.messages;
    const notificationCount = counts.notifications;

    notifyCounter.textContent = notificationCount;

    // ✅ Fetch Notifications (unchanged from earlier)
    fetch("/getAllNotifications", {
        method: "GET"
    })
    .then(res => res.json())
    .then(data => {
        if (data.NotificationData.length > 0) {
            const NotificationArray = data.NotificationData;
            notifyCounter.textContent = notificationCount;

            if(notificationCount < 1) {
                notifyCounter.textContent = "";
                notifyCounter.setAttribute("style", "background-color:transparent;")
                }else{
                    notifyCounter.removeAttribute("style")
                }

            for (let Notification of NotificationArray) {
                Notification_id_container.innerHTML += `
                    <div class="notification ${Notification.status}">
                        <div class="icon">
                            <img src="${Notification.sender_image}" alt="notification_image">
                        </div>
                        <div class="notification_body">
                            <a href="${Notification.end_point}"  onclick="OpenNotification(${Notification.id})">
                                <div class="title">${Notification.content}:</div>
                            </a>
                            <div class="timestamp">${formatTime(Notification.date_sent)}</div>
                        </div>
                    </div>`;
            }
        } else {
            notifyCounter.textContent = "0";
            Notification_id_container.innerHTML += `<li class='no-notification'>No new Notifications to display</li>`;
        }
    });

    // ✅ Now fetch chat message notifications
    const Chat_id_container = document.getElementById("Chat_id_container");
    const chatsCounter = document.getElementById("chats-counter");
    const chatIcon = document.getElementById("chats");

    fetch("/getMessageNotifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
    .then(res => res.json())
    .then(data => {
        Chat_id_container.innerHTML = ""; // Clear previous notifications

        if (data.notifications.length > 0) {
            chatsCounter.textContent = messageCount;
            
            if(messageCount < 1) {
            chatsCounter.textContent = "";
                chatsCounter.setAttribute("style", "background-color:transparent;")
            }else{
                chatsCounter.removeAttribute("style")
            }

            for (let Notification of data.notifications) {
                const notificationElement = document.createElement("div");
                notificationElement.classList.add("notification");

                notificationElement.innerHTML = `
                    <div class="icon">
                        <img src="${Notification.sender_image}" alt="notification_image">
                    </div>
                    <div class="notification_body" onclick="OpenMessageNotification(${Notification.id})">
                        <a href="${Notification.end_point}">
                            <div class="title">${Notification.content}:</div>
                        </a>
                        <div class="timestamp">${formatTime(Notification.date_sent)}</div>
                    </div>`;

                Chat_id_container.appendChild(notificationElement);
            }
        } else {
            chatsCounter.textContent = "0";
            Chat_id_container.innerHTML = `<li class='no-notification'>No new Messages to display</li>`;
        }
    })
    .catch(error => console.error("Error fetching message notifications:", error));

    chatIcon.addEventListener("click", () => {
        chatsCounter.textContent = ""; // reset count on icon click
    });
})();

// Toggle chat container
const chatContainer = document.querySelector('.chat_container');
if(!chatContainer) {
}else{
const toggleChatButton = document.getElementById('toggleChatButton');
toggleChatButton.addEventListener('click', () => {
    chatContainer.style.display = chatContainer.style.display === 'block' ? 'none' : 'block';
});
}
// Reset counter on click
notificationIcon.addEventListener("click", () => {
    notifyCounter.textContent = "";
});

// Open notification function
function OpenNotification(id) {
    fetch("/openNotification", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ notification_id: id }),
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            console.log("Notification opened:", data.success);
        } else {
            console.error("Error opening notification:", data.error);
        }
    });
}


function MarkAllASRead(){
    fetch(`/markAllAsRead`, {
        method:"POST",
        headers:{
            "Content-type" : "application/JSON"
        },
    }).then(res => res.json())
    .then(data =>{
        if(data.success){
            console.log(data.success)
        }else{
            console.log(data.error)
        }
    })
    .catch(error => console.error("Error marking notifications as read:", error));
}