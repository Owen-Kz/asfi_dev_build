// Initialize socket connection
const socket = io("https://asfischolar.org", {
  transports: ["websocket"],
  reconnection: true,            // Enable reconnection
  reconnectionAttempts: 10,      // Number of reconnection attempts
  reconnectionDelay: 1000,       // Delay between reconnection attempts (ms)
  reconnectionDelayMax: 5000,    // Max delay between attempts (ms)
  timeout: 20000,                // Connection timeout (ms)
});

socket.on("connect", () => {
  console.log("WebSocket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});

socket.on("reconnect_attempt", () => {
  console.log("Attempting to reconnect...");
});

socket.on("reconnect", (attempt) => {
  console.log(`Reconnected after ${attempt} attempts`);
});

socket.on("reconnect_failed", () => {
  console.error("Reconnection failed");
});

setInterval(() => {
  if (socket.connected) {
    socket.emit("heartbeat", { timestamp: Date.now() });
  }
}, 30000);

async function GetChatHistory(id){
    return fetch(`/getChatHistory`, {
   method:"POST",
   headers:{
    "Content-type":"application/JSON",
   },
   body:JSON.stringify({ChatId:id})
    }).then(res =>res.json())
    .then(data =>{
        if(data.success){
            return data.history
        }else{
            alert(data.error)
            return []
        }
    })
}

async function GetMessageFiles(id){
  return fetch(`/getSingleChatFile`,{
    method:"POST",
    headers:{
      "Content-type" : "application/json"
    },
    body: JSON.stringify({messageId:id})
  }).then(res =>res.json())
  .then(data =>{
    if(data.success){
      return data.files
    }else{
      console.log(data.error)
      return []
    }
  })
}

let recipientProfilePicture_main
let senderProfilePicture_main



let displayedMessages = 0; // Number of messages currently displayed
const messagesPerLoad = 10; // Number of messages to load per scroll
const newMessages = []; // Array to store new message elements

async function GetChatUserData(id){

  return fetch(`/chatUsers?chat_id=${id}`, {
    method:"POST",
    headers:{
      "Content-type":"application/JSON"
    },
    body:JSON.stringify({chat_id:id})
  }).then(res =>res.json())
  .then(data =>{
    if(data){
    if(data.success){
      return data.recipient[0]
    }else{
      alert(data.error)
      return []
    }
  }
  })
}

async function UpdateChatUI(id){

  // const messageForm = document.getElementById("messageForm")
  // const mediaCanvas = document.getElementById("mediaCanvas")

  // if(messageForm.classList.has("hide")){
  // messageForm.classList.remove("hide")
  // mediaCanvas.classList.remove("hide")
  // }

  const chatID = document.getElementById("chatID")
  const messageContainer = document.getElementById('message-container')
  const chatIdContaner = document.getElementById("chatIdContaner")

  const nameInput = document.getElementById('name-input-sender');

  const userId = nameInput.value;
socket.emit('join-room', id, userId);

  chatIdContaner.value = `${id}`

  const user = await GetChatUserData(id)


  
  const chatHistoryContainer = document.getElementById("chatHistory")

const recipient = document.getElementById('name-input');

recipient.setAttribute("value", user.username)

const recipientProfilePicture = document.getElementById('receiverImage_')
recipientProfilePicture.setAttribute("value", user.profile_picture)


  chatID.setAttribute("value", `[{"id":"${id}"}]`)

    
 

    const chatHistory = await GetChatHistory(id)
    
    chatHistoryContainer.setAttribute("value", `${JSON.stringify(chatHistory)}`)
    
    
    messageContainer.innerHTML = ""
    chatHistory.reverse();


    
    const senderProfilePicture = document.getElementById("senderImage_").value
   

    const recipientProfilrPicture = user.profile_picture
    
    const recipientFullname = `${user.first_name} ${user.last_name}`

    const recipientFullnameContainer = document.getElementById("recipientFullname")
    recipientFullnameContainer.setAttribute("value", recipientFullname)


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
        // console.log(startIndex, endIndex,displayedMessages)
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
    
    async function addMessageToUI_HIstory(isOwnMessage, message, timestamp_, messageId, message_type, messageID, ChatId) {
        // Determine recipient's profile picture
        if (recipientProfilrPicture === "avatar.jpg") {
          recipientProfilePicture_main = `https://res.cloudinary.com/dll8awuig/image/upload/v1705444097/dc69h8mggh01bvlvbowh.jpg`;
        } else {
          recipientProfilePicture_main = await fetchProfileImage(recipientProfilrPicture)
            .then((ReceiverImage) => ReceiverImage || `https://res.cloudinary.com/dll8awuig/image/upload/v1705444097/dc69h8mggh01bvlvbowh.jpg`);
        }
      
        // Determine sender's profile picture
        if (senderProfilePicture === "avatar.jpg") {
          senderProfilePicture_main = `https://res.cloudinary.com/dll8awuig/image/upload/v1705444097/dc69h8mggh01bvlvbowh.jpg`;
        } else {
          senderProfilePicture_main = await fetchProfileImage(senderProfilePicture)
            .then((SenderImage) => SenderImage || `https://res.cloudinary.com/dll8awuig/image/upload/v1705444097/dc69h8mggh01bvlvbowh.jpg`);
        }
      
        // Set recipient profile in the UI
        const recipientProfileImage = document.getElementById("user_image");
        const recipientName = document.getElementById("recipientName");
        recipientProfileImage.removeAttribute("style")
        recipientName.innerText = recipientFullname;
        recipientProfileImage.src = recipientProfilePicture_main;
      
        // Clear any feedback elements
        clearFeedback();
      let element = "<i></i>"
      let fileElement = `<div class="sentFiles  ${isOwnMessage ? 'justify-content-end' : 'justify-content-start'}">`
        // Construct the message element
        if(message_type === "file"){
          const Files = await GetMessageFiles(messageID)
       
          if(Files.length > 0 ){
            for(let i=0; i<Files.length; i++){
              const mainFile = Files[i]

              if(mainFile.file_type.slice(0,5) === "image"){
                fileElement += `<div class="sentImageContainer" style="background-image:url('${mainFile.file_url}');">
                 <a href="javascript:void(0)" onclick=previewImage("${mainFile.file_url}")>
                <img src="${mainFile.file_url}"/>
                </a>
                </div>`
              }else{
                fileElement +=`
       
                   <div class="file-item">
          <a href="${mainFile.file_url}" class="text-info" download="File_${i + 1}">
            📄 ${mainFile.file_name} (${mainFile.file_size})
          </a>
        </div>
                `
              }
              
            }
          }
          fileElement += `</div>`
          element = `
         
          
          <div class="hstack message gap-3 align-items-end mb-7 ${isOwnMessage ? 'justify-content-end' : 'justify-content-end reverse'}" data-message-id="${messageId}">
          <div class="innerMesssageContent ${isOwnMessage ? 'justify-content-end' : 'justify-content-end'}">
          ${fileElement}
           <div class="hstack message gap-3 align-items-end mb-7 ${isOwnMessage ? 'justify-content-end' : 'justify-content-end reverse '}">
        
            <div class="${isOwnMessage ? 'text-end' : 'text-start'}">
              
              <div class="p-2 bg-info-subtle text-dark rounded-1 d-inline-block fs-3">
                ${message}
              </div>
              <h6 class="fs-2 text-muted">${timestamp_}</h6>
              </div>
                  <img 
              src="${isOwnMessage ? senderProfilePicture_main : recipientProfilePicture_main}" 
              alt="user-profile" 
              width="20px" 
              height="20px" 
              class="roundedMessageImage" 
            />
            </div>
            </div>
          </div>
        `;
        }else{
       element = `
          <div class="hstack message gap-3 align-items-end mb-7 ${isOwnMessage ? 'justify-content-end' : 'justify-content-end reverse'}" data-message-id="${messageId}">
           
            <div class="${isOwnMessage ? 'text-end' : ''}">
              
              <div class="p-2 bg-info-subtle text-dark rounded-1 d-inline-block fs-3">
                ${message}
              </div>
              <h6 class="fs-2 text-muted">${timestamp_}</h6>
            </div>
             <img 
              src="${isOwnMessage ? senderProfilePicture_main : recipientProfilePicture_main}" 
              alt="user-profile" 
              width="40" 
              height="40" 
              class="roundedMessageImage" 
            />
          </div>
        `;
        }
      
        // Add the element to the new messages array
        newMessages.push(element);
      }
      
    

    function scrollToBottom() {
      messageContainer.scrollTo(0, messageContainer.scrollHeight)
    }
    

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
            const messageType = chatMessage.message_type
            const messageID = chatMessage.message_id 
            const chatID = chatMessage.chat_id
      
            // Add the message to the newMessages array
           await addMessageToUI_HIstory(isOwnMessage, message, timestamp_, messageId, messageType, messageID, chatID);
      
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
    
    function clearFeedback() {
      document.querySelectorAll('div.message-feedback').forEach((element) => {
        element.parentNode.removeChild(element)
      })
    }
    
    AllChatFiles(id)
    scrollToBottom();

}
