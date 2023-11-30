const socket = io();

const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input-sender');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const sender_Image = document.getElementById("senderImage_").value



const newSender = document.getElementById("newSender")
const newImage = document.getElementById("newImage")

const RoomIDContainer = document.getElementById("SpaceID")

const senderFullname = document.getElementById("senderFulname").value;

const SenderimageContainerMain = document.getElementById("SenderimageContainerMain")

// Get teh senders image 
if (SenderimageContainerMain) {
  fetchProfileImage(sender_Image)
      .then(ReceiverImage => {
// Output the received image URL
          if (ReceiverImage) {
            SenderimageContainerMain.setAttribute("src", ReceiverImage);
          }
      });
}

const messagesPerLoad = 10;
let displayedMessages = 0;
const newMessages = [];
// Get the IDs of messages already displayed
const displayedMessageIds = new Set();
const displayedMessages_ = messageContainer.querySelectorAll('.message');
displayedMessages_.forEach(msg => {
    ``
    const msgId = msg.getAttribute('data-message-id');
    if (msgId) {
        displayedMessageIds.add(msgId);
    }
});
const displayedMessageIds_Array = []

scrollToBottom();
// FORMAT the TIMESTAMP 
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);

    // return `${dayName}, ${monthName} ${day}, ${hours}:${minutes}`;
    return `${dayName}, ${hours}:${minutes}`;


}

async function addMessageToUI_HIstory(isOwnMessage, message, timestamp_, messageId, profile_picture, message_sender, SenderFullname) {

    let senderProfilePicture_main

    if (profile_picture == "avatar.jpg") {
        senderProfilePicture_main = `https://eu.ui-avatars.com/api/?background=random&name=${SenderFullname}&font-size=0.5&rounded=true&size=128&background=random&color=ffffff`;
    } else {
        senderProfilePicture_main = await fetchProfileImage(profile_picture)
    }
    clearFeedback();
    const element = `
        <div class="message-wrapper message ${isOwnMessage ? 'reverse' : ''}" data-message-id="${messageId}">
          <img class="message-pp" src="${senderProfilePicture_main}"  alt="profile-pic"/>
          <div class="message-box-wrapper">
            <div class="message-box">
            <p class='message-wrap'> ${message} </p>
            </div>
    <span>${SenderFullname}</span>
            <span>${timestamp_}</span>
          </div>
        </div>
    `;

    newMessages.push(element); // Add the element to the array
}




// Get chat History -
getChatHistory(SpaceId)
    .then(chatHistoryData => {
        if (chatHistoryData) {
            ChatArray.setAttribute("value", chatHistoryData);

            var chatHistoryContainer = JSON.parse(chatHistoryData)
            chatHistoryContainer.reverse();

            if (chatHistoryContainer.length > 0) {
                if (chatHistoryContainer.length < messagesPerLoad) {
                    chatHistory_(0, chatHistoryContainer.length)

                    displayedMessages += chatHistoryContainer.length;
                    
                } else {
                    chatHistory_(0, messagesPerLoad - 1)
                    displayedMessages += messagesPerLoad;
                }
            }
        }
async function chatHistory_(startIndex, endIndex) {


    if (chatHistoryContainer.length > 0) {
        newMessages.length = 0;
        // Iterate through the chat history array
        for (i = endIndex - 1; i >= startIndex; i--) {
            const chatMessage = chatHistoryContainer[i];

            const messageId = chatMessage.timestamp;

            if (!displayedMessageIds.has(messageId)) {
                // Message not displayed yet, proceed to add it
                const isOwnMessage = chatMessage.sender_id === nameInput.value;
                const message = chatMessage.content;

                const originalTimestamp = new Date(chatMessage.timestamp);
                const formattedTimestamp = formatTimestamp(originalTimestamp);

                const timestamp_ = formattedTimestamp;
                const Sender_ = chatMessage.sender_id;
                const SenderFullname = chatMessage.senderFullname;
                const profile_picture = chatMessage.senderProfilePicture


                // Add the message to the newMessages array
                await addMessageToUI_HIstory(isOwnMessage, message, timestamp_, messageId, profile_picture, Sender_, SenderFullname);

                // Add the message ID to the displayedMessageIds set
                displayedMessageIds.add(messageId);
                displayedMessageIds_Array.push(messageId)
            } else {
            }
        }

        // Insert the new messages at the beginning of the container
        messageContainer.innerHTML = newMessages.join('') + messageContainer.innerHTML;
    }

}


// Function to handle scroll event
let isLoadingMessages = false; // Flag to track if messages are being loaded

// Function to handle scroll event
function handleScroll() {
    const scrollTop = messageContainer.scrollTop;
    if (scrollTop === 0 && displayedMessages >= messagesPerLoad && !isLoadingMessages) {
        isLoadingMessages = true; // Set the flag to true
        // const endIndex = displayedMessages + 1;
        // const endIndex = chatHistoryContainer.length - displayedMessageIds.length;
        if (messagesPerLoad >= chatHistoryContainer.length) {
            // const startIndex = Math.max(displayedMessageIds_Array[0] - (messagesPerLoad + 1), 0);
            const startIndex = chatHistoryContainer[0];

            const endIndex = chatHistoryContainer.length;

            chatHistory_(startIndex, endIndex);
            displayedMessages = startIndex + 1;
            console.log(startIndex, endIndex, displayedMessages)
        } else if (messagesPerLoad <= chatHistoryContainer.length) {
            const startIndex = 9;
            // const startIndex = Math.max((displayedMessageIds_Array[0]) - messagesPerLoad),0);
            const endIndex = chatHistoryContainer.length;

            // console.log(chatHistoryContainer);
            chatHistory_(startIndex, endIndex);

            displayedMessages = displayedMessageIds_Array.length;

        }
        const endIndex = chatHistoryContainer.length;

        // const startIndex = Math.max(endIndex - displayedMessages + 1, 0);

        isLoadingMessages = false; // Reset the flag after loading
    }
}

// Debounce function
function debounce(func, delay) {
    let timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(func, delay);
    };
}

// Debounced scroll handler
const debouncedHandleScroll = debounce(handleScroll, 300);

// Attach debounced scroll event listener to chat container
messageContainer.addEventListener('scroll', debouncedHandleScroll);
})
.catch(error => console.error("Error getting chat history:", error));
//END PAGINATION CODE

// Submit messages 
messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMessage()
})
// Generate a unique room ID based on the group chat ID
const roomId = RoomIDContainer.value;
const userId = nameInput.value;

socket.emit('join-group-chat', roomId, userId);

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
});

function sendMessage() {
    if (messageInput.value === '') return;
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        fullname: newSender.value,
        profile_image: newImage.value,
        inbox: roomId,
        dateTime: new Date(),
    };
    socket.emit('group-chat-message', data, roomId);
    messageInput.value = '';
}

socket.on('group-chat-message', async (data) => {

    if (data.name === userId) {
        await addMessageToUI(true, data)
    } else {
        await addMessageToUI(false, data)
    }
});

async function addMessageToUI(isOwnMessage, data) {
    clearFeedback();

    const others_profileImage = data.profile_image
    const others_fullname = data.fullname
    
    const senderProfilePicture = sender_Image



    const senderProfilePicture_main = (senderProfilePicture === "avatar.jpg") ? `https://eu.ui-avatars.com/api/?background=random&name=${senderFullname}&font-size=0.5&rounded=true&size=128&background=333333&color=ffffff` : await fetchProfileImage(senderProfilePicture);

    const othersProfileImage_main = (others_profileImage === "avatar.jpg") ? `https://eu.ui-avatars.com/api/?background=random&name=${others_fullname}&font-size=0.5&rounded=true&size=128&background=333333&color=ffffff` : await fetchProfileImage(others_profileImage);

    const element = `
    <div class="message-wrapper message ${isOwnMessage ? 'reverse' : ''}">
      <img class="message-pp" src="${isOwnMessage ? senderProfilePicture_main : othersProfileImage_main}" alt="profile-pic"/>
      <div class="message-box-wrapper">
        <div class="message-box">
          <p class='message-wrap'>${data.message}</p>
        </div>
        <span>Few moments ago</span>
      </div>
    </div>
  `;
    messageContainer.innerHTML += element;
    scrollToBottom();
}

function clearFeedback() {
    const feedbackElement = document.getElementById('feedback');
    if (feedbackElement) {
        feedbackElement.parentNode.removeChild(feedbackElement);
    }
}

messageInput.addEventListener('focus', () => {
    socket.emit('feedback', {
        feedback: `✍️ @${nameInput.value} is typing a message`,
    });
});

messageInput.addEventListener('blur', () => {
    socket.emit('feedback', {
        feedback: '',
    });
});

socket.on('feedback', (data) => {
    clearFeedback();
    const element = `<p class="feedback" id="feedback">${data.feedback}</p>`;
    messageContainer.insertAdjacentHTML('beforeend', element);
});

function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
}
