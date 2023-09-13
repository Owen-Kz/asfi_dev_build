

const  Notification_id_container = document.getElementById("Notification_id_container")
const usernameContainer = document.getElementById("usernameContainer").value



fetch(`/${usernameContainer}/getNewChatNotifications`, ()=>{
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


            Notification_id_container.innerHTML +=`<li><a href="/@${Sender}/chat">New Message From ${Sender}</a></li>`
        });
    }else{
        Notification_id_container.innerHTML +=`<li>No new Messages to display</li>`

    }

})