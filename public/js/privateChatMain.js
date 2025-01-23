// Initialize socket connection
// const socket = io();

// UI Elements
const clientsTotal = document.getElementById('client-total');
const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input-sender');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const recipient = document.getElementById('name-input');
const chatInboxIDContainer = document.getElementById('chatID').value;
const chatInbox = chatInboxIDContainer;

const senderProfilePicture = document.getElementById('senderImage_').value;
const recipientProfilePicture = document.getElementById('receiverImage_').value;

const recipientFullname = document.getElementById('recipientFullname').value;
const senderFullname = document.getElementById('senderFulname').value;

const recipientImageContainerMain = document.getElementById('recipientimageContainerMain');
const senderImageContainerMain = document.getElementById('SenderimageContainerMain');
const chatFiles = document.getElementById('files');

// Set profile images if available
if (recipientImageContainerMain) {
  fetchProfileImage(recipientProfilePicture).then((image) => {
    if (image) recipientImageContainerMain.setAttribute('src', image);
  });
}

if (senderImageContainerMain) {
  fetchProfileImage(senderProfilePicture).then((image) => {
    if (image) senderImageContainerMain.setAttribute('src', image);
  });
}

let recipientProfilePictureMain;
let senderProfilePictureMain;

scrollToBottom();

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  return `${days[date.getDay()]}, ${hours}:${minutes}`;
}
const chatIdContaner = document.getElementById("chatIdContaner")
// Join the chat room
const roomId = chatIdContaner.value;
const userId = nameInput.value;
// socket.emit('join-room', roomId, userId);

// Submit message
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  sendMessage();

});

async function sendMessage() {
  if (messageInput.value === '' && chatFiles.files.length === 0) return;

  const data = {
    name: nameInput.value,
    message: messageInput.value,
    receiver: recipient.value,
    inbox: chatIdContaner.value,
    dateTime: new Date().toString(),
    files: chatFiles.files,
  };

  if(chatFiles.files[0]){
    submitTextFiles()
  }
  socket.emit('message', data, roomId);

  // await renderFiles(chatFiles.files, true);
  
  messageInput.value = '';
  chatFiles.value = '';
  imagePreviewMain.innerHTML = ""
}

socket.on('chat-message', async (data) => {

  const isOwnMessage = data.name === userId;
  await addMessageToUI(isOwnMessage, data);
});

let fileContent = ""
async function addMessageToUI(isOwnMessage, data) {
  // const arrayBuffer = data.files[0];
    
  // // Determine file type (for example, image or text)
  // const fileType = "image"; // Change this based on your logic

  clearFeedback();

  if (!recipientProfilePictureMain) {
    recipientProfilePictureMain = recipientProfilePicture === 'avatar.jpg'
      ? `https://eu.ui-avatars.com/api/?background=random&name=${recipientFullname}&size=128`
      : await fetchProfileImage(recipientProfilePicture);
  }

  if (!senderProfilePictureMain) {
    senderProfilePictureMain = senderProfilePicture === 'avatar.jpg'
      ? `https://eu.ui-avatars.com/api/?background=random&name=${senderFullname}&size=128`
      : await fetchProfileImage(senderProfilePicture);
  }

  const profilePicture = isOwnMessage ? senderProfilePictureMain : recipientProfilePictureMain;
  const timestamp = formatTimestamp(data.dateTime);
  const filesUI = await renderFilesUI(data.files) || "";

  const element = `
    <div class="hstack message gap-3 align-items-end mb-7 ${isOwnMessage ? 'justify-content-end' : 'justify-content-end reverse'}">
       <div class="innerMesssageContent ${isOwnMessage ? 'justify-content-end' : 'justify-content-start'}">
      <div class="sentFiles ${isOwnMessage ? 'justify-content-end' : 'justify-content-start'}">
        ${filesUI}

        </div>
      <div class="hstack message gap-3 align-items-end mb-7 ${isOwnMessage ? 'justify-content-end' : 'justify-content-start reverse'}">
      <div class="${isOwnMessage ? 'text-end' : ''}">
        
        <div class="p-2 bg-info-subtle text-dark rounded-1 d-inline-block fs-3">
          ${data.message}
        </div>
        <h6 class="fs-2 text-muted">${timestamp}</h6>
      </div>
       <img src="${profilePicture}" alt="user-profile" 
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

async function renderFiles(files, isOwnMessage) {
  // const filesUI = await renderFilesUI(files);
  // const element = `
  //   <div class="hstack gap-3 align-items-start mb-7 ${isOwnMessage ? 'justify-content-end' : 'justify-content-start'}">
      
  //   <div class="sentFiles">${fileContent}</div>
  //   </div>
  // `;
  // messageContainer.innerHTML += element;
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
          <a href="javascript:void(0)" onclick=previewImage("${url}")>
          <img src="${url}" alt="Image ${i + 1}" />
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


function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener('focus', () => {
  socket.emit('feedback', { feedback: `✍️ @${nameInput.value} is typing a message` });
});

messageInput.addEventListener('blur', () => {
  socket.emit('feedback', { feedback: '' });
});

socket.on('feedback', (data) => {
  clearFeedback();
  const element = `
    <div class="message-feedback">
      <p class="feedback">${data.feedback}</p>
    </div>
  `;
  messageContainer.innerHTML += element;
});

function clearFeedback() {
  document.querySelectorAll('.message-feedback').forEach((element) => {
    element.parentNode.removeChild(element);
  });
}
