const socket = io()

const clientsTotal = document.getElementById('client-total')

const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input-sender')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')
const recipient = document.getElementById("name-input")
const chatHistory_container  = document.getElementById("chatHistory").value
const chatHistory = JSON.parse(chatHistory_container)
const chat_inbox_ID_CONTAINER = document.getElementById("chatID").value
const chat_inbox = JSON.parse(chat_inbox_ID_CONTAINER)

const senderProfilePicture = document.getElementById("senderImage_").value
const recipientProfilrPicture = document.getElementById("receiverImage_").value

const recipientFullname = document.getElementById("recipientFullname").value
const senderFullname = document.getElementById("senderFulname").value

const recipientimageContainerMain = document.getElementById("recipientimageContainerMain")
const SenderimageContainerMain = document.getElementById("SenderimageContainerMain")


if (recipientimageContainerMain) {
  fetchProfileImage(recipientProfilrPicture)
      .then(ReceiverImage => {
// Output the received image URL
          if (ReceiverImage) {
              recipientimageContainerMain.setAttribute("src", ReceiverImage);
          }
      });
}

// Get teh senders image 
if (SenderimageContainerMain) {
  fetchProfileImage(senderProfilePicture)
      .then(ReceiverImage => {
// Output the received image URL
          if (ReceiverImage) {
            SenderimageContainerMain.setAttribute("src", ReceiverImage);
          }
      });
}


let recipientProfilePicture_main
let senderProfilePicture_main



let displayedMessages = 0; // Number of messages currently displayed
const messagesPerLoad = 10; // Number of messages to load per scroll
chatHistory.reverse();
// console.log(chatHistory)
const newMessages = []; // Array to store new message elements

  // Get the IDs of messages already displayed
  const displayedMessageIds = new Set();
  const displayedMessages_ = messageContainer.querySelectorAll('.message');
  displayedMessages_.forEach(msg => {``
    const msgId = msg.getAttribute('data-message-id');
    if (msgId) {
      displayedMessageIds.add(msgId);
    }
  });
  const displayedMessageIds_Array = []
  // console.log(displayedMessageIds_Array)
  // console.log(displayedMessageIds)
  // console.log(displayedMessageIds.values().next().value)


if(chatHistory.length > 0){
  if(chatHistory.length < messagesPerLoad){
chatHistory_(0, chatHistory.length)
displayedMessages += chatHistory.length;
  }else{
    chatHistory_(0, messagesPerLoad - 1)
displayedMessages += messagesPerLoad;
  }

// chatHistory.push({id: (chatHistory.length + 1), sender_id: 'Non_existent', recipient_id: 'Non-Existent', content: 'Non-Existent', timestamp: 'N/A',}) 

}

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

// console.log(formattedTimestamp); // Outputs: Fri, Aug 18, 00:33
// END FORMAT TIME STAMP
// Get chat History -
// Clear the newMessages array


async function chatHistory_(startIndex, endIndex) {
  if(chatHistory.length > 0){
  newMessages.length = 0;
  // Iterate through the chat history array
  for (i = endIndex -1 ; i >= startIndex; i--) {
    const chatMessage = chatHistory[i];
    const messageId = chatMessage.id; // Replace with the actual message ID property
// console.log(messageId)
    if (!displayedMessageIds.has(messageId)) {
      // Message not displayed yet, proceed to add it
      const isOwnMessage = chatMessage.sender_id === nameInput.value;
      const message = chatMessage.content;

      const originalTimestamp = new Date(chatMessage.timestamp);
      const formattedTimestamp = formatTimestamp(originalTimestamp);

      const timestamp_ = formattedTimestamp;
      const Sender_ = chatMessage.sender_id;

      // Add the message to the newMessages array
     await addMessageToUI_HIstory(isOwnMessage, message, timestamp_, messageId);

      // Add the message ID to the displayedMessageIds set
      displayedMessageIds.add(messageId);
      displayedMessageIds_Array.push(messageId)
    }else{
    }
  }

  // Insert the new messages at the beginning of the container
  messageContainer.innerHTML = newMessages.join('') + messageContainer.innerHTML;
}
}


// Function to handle scroll event
let isLoadingMessages = false; // Flag to track if messages are being loaded


// Function to handle scroll event
async function handleScroll() {
  const scrollTop = messageContainer.scrollTop;
  if (scrollTop === 0 && displayedMessages >= messagesPerLoad && !isLoadingMessages) {
    isLoadingMessages = true; // Set the flag to true
    // const endIndex = displayedMessages + 1;
    // const endIndex = chatHistory.length - displayedMessageIds.length;
    if(messagesPerLoad >= chatHistory.length){
    // const startIndex = Math.max(displayedMessageIds_Array[0] - (messagesPerLoad + 1), 0);
    const startIndex = chatHistory[0];

    const endIndex = chatHistory.length;

    await chatHistory_(startIndex, endIndex);
    displayedMessages = startIndex + 1;
    console.log(startIndex, endIndex,displayedMessages)
    }else if(messagesPerLoad <= chatHistory.length){
    const startIndex = 9;
    // const startIndex = Math.max((displayedMessageIds_Array[0]) - messagesPerLoad),0);
    const endIndex = chatHistory.length;

    // console.log(chatHistory);
    await chatHistory_(startIndex, endIndex);

    displayedMessages = displayedMessageIds_Array.length;

    }
    const endIndex = chatHistory.length;

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

//END PAGINATION CODE

// Submit messages 
messageForm.addEventListener('submit', (e) => {
  e.preventDefault()
  sendMessage()
})

// Generate unique sockets and rooms 
// Generate a unique room ID based on the user IDs

const roomId = chat_inbox[0].id
const userId = nameInput.value; // Replace with actual user ID

socket.emit("join-room", roomId, userId);

async function sendMessage() {
  if (messageInput.value === '') return
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    receiver: recipient.value,
    inbox: chat_inbox[0].id,
    dateTime: new Date(),
  }
  socket.emit('message', data, roomId)
  messageInput.value = ''
}

socket.on('chat-message', async (data, isOwnMessage) => {
  if(data.name === userId){
    await addMessageToUI(true, data)
  }else{
    await addMessageToUI(false, data)
  }
})

async function addMessageToUI_HIstory(isOwnMessage, message, timestamp_,messageId) {

  if(recipientProfilrPicture == "avatar.jpg"){
    recipientProfilePicture_main = `https://eu.ui-avatars.com/api/?background=random&name=${recipientFullname}&font-size=0.5&rounded=true&size=128&background=333333&color=ffffff`;
   }else{
 
    await fetchProfileImage(recipientProfilrPicture)
     .then(ReceiverImage => {
 // Output the received image URL
         if (ReceiverImage) {
           recipientProfilePicture_main = ReceiverImage
         }
     });
     
   }
 
   if(senderProfilePicture == "avatar.jpg"){
     senderProfilePicture_main = `https://eu.ui-avatars.com/api/?background=random&name=${senderFullname}&font-size=0.5&rounded=true&size=128&background=333333&color=ffffff`;
   }else{ 
 
    await fetchProfileImage(senderProfilePicture)
     .then(SenderImage => {
 // Output the received image URL
         if (SenderImage) {
           senderProfilePicture_main  = SenderImage
         }
     });
   }
  clearFeedback(); 
  const element = ` 
      <div class="message-wrapper message ${isOwnMessage ? 'reverse' : ''}" data-message-id="${messageId}">
        <img class="message-pp" src="${isOwnMessage ? `${senderProfilePicture_main}` :  `${recipientProfilePicture_main}`}"  alt="profile-pic"/>
        <div class="message-box-wrapper">
          <div class="message-box">
          <p class='message-wrap'> ${message} </p>
          </div>
          <span>${timestamp_}</span>
        </div>
      </div>
  `;

  newMessages.push(element); // Add the element to the array
}


async function addMessageToUI(isOwnMessage, data) {
  clearFeedback()
  // console.log(data)
  if(recipientProfilrPicture == "avatar.jpg"){
    recipientProfilePicture_main = `https://eu.ui-avatars.com/api/?background=random&name=${recipientFullname}&font-size=0.5&rounded=true&size=128&background=333333&color=ffffff`;
   }else{
 
    await fetchProfileImage(recipientProfilrPicture)
     .then(ReceiverImage => {
 // Output the received image URL
         if (ReceiverImage) {
           recipientProfilePicture_main = ReceiverImage
         }
     });
     
   }
 
   if(senderProfilePicture == "avatar.jpg"){
     senderProfilePicture_main = `https://eu.ui-avatars.com/api/?background=random&name=${senderFullname}&font-size=0.5&rounded=true&size=128&background=333333&color=ffffff`;
   }else{ 
 
    await fetchProfileImage(senderProfilePicture)
     .then(SenderImage => {
 // Output the received image URL
         if (SenderImage) {
           senderProfilePicture_main  = SenderImage
         }
     });
   }
  const element = `<div class="message-wrapper message ${isOwnMessage ? 'reverse' : ''}" data-message-id="${data.dateTime+data.inbox}">
  <img class="message-pp" src="${isOwnMessage ? `${senderProfilePicture_main}` :  `${recipientProfilePicture_main}`}"  alt="profile-pic"/>
  <div class="message-box-wrapper">
    <div class="message-box">
    <p class='message-wrap'>${data.message}</p>
    </div>
    <span>Few moments ago</span>
  </div>
</div>`;
  messageContainer.innerHTML += element
  scrollToBottom()
}

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

messageInput.addEventListener('focus', (e) => {
  socket.emit('feedback', {
    feedback: `✍️ @${nameInput.value} is typing a message`,
  })
})

messageInput.addEventListener('keypress', (e) => {
  socket.emit('feedback', {
    feedback: `✍️ @${nameInput.value} is typing a message`,
  })
})
messageInput.addEventListener('blur', (e) => {
  socket.emit('feedback', {
    feedback: '',
  })
})

socket.on('feedback', (data) => {
  clearFeedback()
  const element = `
        <div class="message-feedback">
          <p class="feedback" id="feedback">${data.feedback}</p>
        </div>
  `
  messageContainer.innerHTML += element
})

function clearFeedback() {
  document.querySelectorAll('div.message-feedback').forEach((element) => {
    element.parentNode.removeChild(element)
  })
}



// ADD RECENT MESSAGES 
const RecentMessageArray = document.getElementById("recent_message_recipient").value;
const RecentMessage = JSON.parse(RecentMessageArray)

if(RecentMessage.length > 0){
  const RecentCountContainer = document.getElementById("c-number")
  RecentCountContainer.innerText = RecentMessage.length
  const RecentChatList = document.getElementById("active_conversations")
  RecentMessage.forEach(async (recentChat) => {
    // console.log(RecentMessage)

    const messageContent = recentChat.LastMessage
    const MessageRecipient = recentChat.Receiver
    const messageSender = recentChat.SentBy
    const messageTimestamp = recentChat.TimeStamp

    let PersonProfileImage 

 


    var ActualSender
    var ActualReceiver
    var ActualSenderText

    if(MessageRecipient == nameInput.value){
      ActualSender = messageSender

      
    }else{
      ActualSender = MessageRecipient
      ActualSenderText = `@${ActualSender}`
    }

    if(messageSender == nameInput.value){
      ActualReceiver = MessageRecipient
    }else{
      ActualSender = messageSender
      ActualSenderText = `@${ActualSender}`
    }

    if(messageSender == nameInput.value && MessageRecipient == nameInput.value){
      ActualSenderText = "Note To Self"
    }

// GET sENDER IMAGE 
    fetch(`/userprofile/image/profileImage/${ActualSender}`,()=>{
      method: "GET"
    }).then(res => res.json())
    .then(data =>{
      PersonProfileImage = data.profile_image
    })
let SenderMainProfileimage

    if(PersonProfileImage != "avatar.jpg"){
     await fetchProfileImage(recipientProfilrPicture)
      .then(ReceiverImage => {
// Output the received image URL
          if (ReceiverImage) {
            SenderMainProfileimage =  `${ReceiverImage}`
          }
      });
    }else{
      SenderMainProfileimage  = `https://eu.ui-avatars.com/api/?background=random&name=${ActualSender}&font-size=0.5&rounded=true&size=128&background=333333&color=ffffff" alt="ProfileImage`
      }

    const originalMessageTimestamp = new Date(messageTimestamp);
    const formattedMessageTimestamp = formatTimestamp(originalMessageTimestamp);

    const RecentChatContent = `<li class="chat-list-item active">
    <a href="/@${ActualSender}"> 
      <img src=${SenderMainProfileimage} />
      </a>
          <a href="/@${ActualSender}/chat"><div class='recent_chat_content'>
          <span class="chat-list-name">${ActualSenderText}</span>
          <br>
          <span class="new_message_content"> 
          ${messageContent}
          </span>
          </div>
          </a>
          <code class="chat_time">${formattedMessageTimestamp} </code>
          
          </li>`;

  
  RecentChatList.innerHTML += RecentChatContent
   const active_conversations = document.getElementById("active_conversations")
    const limitedTextElements = active_conversations.querySelectorAll(".new_message_content")
const maxLength = 15

limitedTextElements.forEach(LimitedTextDiv=>{
  if (LimitedTextDiv.innerText.length > maxLength) {
    LimitedTextDiv.innerText = LimitedTextDiv.innerText.substring(0, maxLength) + "...";
}
})

    
  })
}