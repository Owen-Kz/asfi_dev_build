const socket = io("https://asfischolar.org", {
  transports: ["websocket"],
});

const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input-sender');
const messageForm = document.getElementById('message-form');
const messageInputMain = document.getElementById('message-input');
const sender_Image = document.getElementById("senderImage_").value


const chatFiles = document.getElementById('files');
const newSender = document.getElementById("newSender") 
const newImage = document.getElementById("newImage") 

const RoomIDContainer = document.getElementById("SpaceID")

const senderFullname = document.getElementById("senderFulname").value;

const SenderimageContainerMain = document.getElementById("SenderimageContainerMain")
function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
  }
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
function getFileType(arrayBuffer) {
    const uint8Array = new Uint8Array(arrayBuffer);
  
    // Check for PNG
    if (
      uint8Array[0] === 0x89 &&
      uint8Array[1] === 0x50 &&
      uint8Array[2] === 0x4e &&
      uint8Array[3] === 0x47
    ) {
      return "image/png";
    }
  
    // Check for JPEG
    if (
      uint8Array[0] === 0xff &&
      uint8Array[1] === 0xd8 &&
      uint8Array[2] === 0xff
    ) {
      return "image/jpeg";
    }
  
    // Check for PDF
    if (
      uint8Array[0] === 0x25 &&
      uint8Array[1] === 0x50 &&
      uint8Array[2] === 0x44 &&
      uint8Array[3] === 0x46
    ) {
      return "application/pdf";
    }
  
    return "unknown";
  }
  
  
  async function renderFilesUI(files) {
  
  
    // Convert the files object to an array of ArrayBuffers
    const fileArray = Object.values(files);
  
    if (fileArray.length === 0) return;
  
    let fileContent = ""; // Initialize fileContent
  
    for (let i = 0; i < fileArray.length; i++) {
      const arrayBuffer = fileArray[i];
  
      // Generate a Blob from the ArrayBuffer
      const type = getFileType(arrayBuffer);
      const blob = new Blob([arrayBuffer], { type });
  
      const url = URL.createObjectURL(blob);
  
    
      // Add HTML based on assumed file type
      let fileContainer = "";
      if (blob.type.startsWith("image")) {
        fileContainer = `
          <div class="sentImageContainer">
           <a href="javascript:void(0)" onclick=previewImage("${url}")> <img src="${url}" alt="Image ${i + 1}" />
           </a>
          </div>
        `;
      } else {
        fileContainer = `
          <div class="file-item">
            <a href="${url}" class="text-info" download="File_${i + 1}">
              📄 File ${i + 1} (${(arrayBuffer.byteLength / 1024).toFixed(2)} KB)
            </a>
          </div>
        `;
      }
  
      fileContent += fileContainer; // Accumulate HTML content
    }
    return fileContent || ""
  
   
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

async function addMessageToUI_HIstory(isOwnMessage, message, timestamp_, messageId, profile_picture, message_sender, SenderFullname, message_type, messageID) {

    let senderProfilePicture_main

    if (profile_picture == "avatar.jpg") {
        senderProfilePicture_main = `https://eu.ui-avatars.com/api/?background=random&name=${SenderFullname}&font-size=0.5&rounded=true&size=128&background=random&color=ffffff`;
    } else {
        senderProfilePicture_main = await fetchProfileImage(profile_picture)
    }
    clearFeedback();

    let element = "<i></i>"
    let fileElement = `<div class="sentFiles">`
      // Construct the message element
      if(message_type === "file"){
        const Files = await GetMessageFiles(messageID)
        if(Files.length > 0 ){
          for(let i=0; i<Files.length; i++){
            const mainFile = Files[i]

            if(mainFile.file_type.slice(0,5) === "image"){
              fileElement += `<div class="sentImageContainer" style="background-image:url('${mainFile.file_url}');">
              <a href="javascript:void(0)" onclick=previewImage("${mainFile.file_url}")>
              <img src="${mainFile.file_url}"/></div>
              </a>`
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
        <div class="innerMesssageContent ${isOwnMessage ? 'justify-content-end' : 'justify-content-start'}">
        ${fileElement}
         <div class="hstack message gap-3 align-items-end mb-7 ${isOwnMessage ? 'justify-content-end' : 'justify-content-start reverse'}">
      
          <div class="${isOwnMessage ? 'text-end' : ''}">
           
            <div class="p-2 bg-info-subtle text-dark rounded-1 d-inline-block fs-3">
              ${message}
            </div>
             <h6 class="fs-2 text-muted">
                <span>${SenderFullname}</span>
            <span>${timestamp_}</span>
            </h6>
            </div>
                <img 
            src="${senderProfilePicture_main}" 
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
              <h6 class="fs-2 text-muted">
                <span>${SenderFullname}</span>
            <span>${timestamp_}</span>
            </h6>
          </div>
           <img 
            src="${senderProfilePicture_main}" 
            alt="user-profile" 
            width="40" 
            height="40" 
            class="roundedMessageImage" 
          />
        </div>
      `;
      }
 

    newMessages.push(element); // Add the element to the array
    scrollToBottom();
}




// Get chat History -
if(SpaceId){
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
                const messageType = chatMessage.message_type 
                const messageID = chatMessage.message_id
            


                // Add the message to the newMessages array
                await addMessageToUI_HIstory(isOwnMessage, message, timestamp_, messageId, profile_picture, Sender_, SenderFullname, messageType, messageID);

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
            // console.log(startIndex, endIndex, displayedMessages)
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
}else{
    console.log("No Space id provided")
}
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
    if (messageInputMain.value === '' && chatFiles.files.length === 0) return;
    const data = {
        name: nameInput.value,
        message: messageInputMain.value,
        fullname: newSender.value,
        profile_image: newImage.value,
        inbox: roomId,
      dateTime: new Date().toString(),
      files: chatFiles.files,
    };

    if(chatFiles.files[0]){
      submitSpaceFiles()
    }
    socket.emit('group-chat-message', data, roomId);

    // await renderFiles(chatFiles.files, true);
    
    messageInputMain.value = '';
    chatFiles.value = '';
    imagePreviewMain.innerHTML = ""

 

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

    const filesUI = await renderFilesUI(data.files) || "";

    const element = `
      <div class="hstack message gap-3 align-items-end mb-7 ${isOwnMessage ? 'justify-content-end' : 'justify-content-end reverse'}">
         <div class="innerMesssageContent ${isOwnMessage ? 'justify-content-end' : 'justify-content-start'}">
        <div class="sentFiles">
          ${filesUI}
  
          </div>
        <div class="hstack message gap-3 align-items-end mb-7 ${isOwnMessage ? 'justify-content-end' : 'justify-content-start reverse'}">
        <div class="${isOwnMessage ? 'text-end' : ''}">
          
          <div class="p-2 bg-info-subtle text-dark rounded-1 d-inline-block fs-3">
            ${data.message}
          </div>
          <h6 class="fs-2 text-muted">Few Moments Ago</h6>
        </div>
         <img rc="${isOwnMessage ? senderProfilePicture_main : othersProfileImage_main}" alt="profile-pic"
                width="20px" 
                height="20px" 
                class="roundedMessageImage" />
          </div>
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

messageInputMain.addEventListener('focus', () => {
    socket.emit('feedback', {
        feedback: `✍️ @${nameInput.value} is typing a message`,
    });
});

messageInputMain.addEventListener('blur', () => {
    socket.emit('feedback', {
        feedback: '',
    });
});

socket.on('feedback', (data) => {
    clearFeedback();
    const element = `<p class="feedback" id="feedback">${data.feedback}</p>`;
    messageContainer.insertAdjacentHTML('beforeend', element);
});

// function scrollToBottom() {
//     messageContainer.scrollTo(0, messageContainer.scrollHeight);
// }
