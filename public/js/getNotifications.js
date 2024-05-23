// console.log("Notifications")

const  Notification_id_container = document.getElementById("Notification_id_container")
const usernameContainer = document.getElementById("usernameContainer").value
fetch("/getNewChatNotifications", ()=>{
    method:"GET"
})
.then(res => res.json())
.then(data =>{
    if(JSON.parse(data.NotificationData).length > 0){
        const NotificationArray = JSON.parse(data.NotificationData)

        NotificationArray.forEach(Notification => {
            let Sender

            const User_one= Notification.user_one
            const UserTwo = Notification.user_two

            if(User_one == usernameContainer){
                Sender = UserTwo
            }else{
                Sender = User_one
            }
            Notification_id_container.innerHTML +=`<li><a href="/@${Sender}/chat">Chat with ${Sender}</a></li>`;
        });
    }else{
        Notification_id_container.innerHTML +=`<li class='no-notification'>No new Messages to display</li>`;

    }

})

// JavaScript code to toggle chat_container visibility
const chatContainer = document.querySelector('.chat_container');
const toggleChatButton = document.getElementById('toggleChatButton');

toggleChatButton.addEventListener('click', () => {
    // Toggle the visibility of chat_container
    chatContainer.style.display = chatContainer.style.display === 'block' ? 'none' : 'block';
});