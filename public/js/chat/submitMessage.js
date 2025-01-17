// handle message sending and UI  updates 
const MessageMain = document.getElementById("message-form")
const sendMessageButton = document.getElementById("send-message")
const messageInputField = document.querySelector('#message-input');
const submitMessage = document.getElementById("submit")
const imagePreviewMain = document.getElementById('image-preview');
const messageInput = document.getElementById('message-input')

const sendImage = document.getElementById("sendImage")
const FIleInput = document.getElementById("files")

const sendAttachment = document.getElementById("sendAttachment")

sendMessageButton.addEventListener("click", function(){
    if(messageInputField.value !== "" || messageInputField.value !== "" || FIleInput.files){
        submitMessage.click()
    }
})

if(sendImage){
    sendImage.addEventListener("click", function(){
        FIleInput.setAttribute("accept", "image/*")
        FIleInput.click()
    })
}

if(sendAttachment){
    sendAttachment.addEventListener("click", function(){
        FIleInput.setAttribute("accept", ".docx, .doc, .pdf, .pptx, .png, .jpg, .jpeg, .mp4")
        FIleInput.click()
    })
}


// Upload the files to the database 
const recipient = document.getElementById("name-input")
const chat_inbox_ID_CONTAINER = document.getElementById("chatID").value
const chat_inbox = JSON.parse(chat_inbox_ID_CONTAINER)


function submitTextFiles(){
    const FormDataMain = new FormData(MessageMain)
    // FormDataMain.append("chatId", chatId)
    // FormDataMain.append("text", messageInput.value)
    FormDataMain.append("receiver", recipient.value)
    FormDataMain.append("timestamp", new Date())

  

    fetch(`/uploadPrivateChatFIles`, {
        method:"POST",
        body: FormDataMain,
    }).then(res =>res.json())
    .then(data =>{
        //  FIleInput.value = ""
            
        if(data.success){
            FIleInput.value = ""
            imagePreviewMain.innerHTML = ""
        }else if(data.error){
            alert(data.error)
        }else{
            alert(data.message)
        }
    })
}