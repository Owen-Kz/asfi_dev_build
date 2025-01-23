
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
    return `${dayName}, ${monthName}`;
  
  }



async function AllChatFiles(id) {
    const chatImageFiles = document.getElementById("chatImageFiles")
const otherFiles = document.getElementById("otherFiles")
const imageFileCount = document.getElementById("imageFileCount")

    fetch(`/getAllChatFiles`, {
        method:"POST",
        headers:{
            "Content-type": "application/json"
        },
        body:JSON.stringify({chatId:id})
    }).then(res =>res.json())
    .then(data =>{
        chatImageFiles.innerHTML  = ""
        otherFiles.innerHTML = ""
        imageFileCount.innerText = "0"

        if(data.success){
            const ChatFiles = data.chatFiles
            if(ChatFiles.length >0){
                
                imageFileCount.innerText =`${new Number(imageFileCount.innerText) + 1} `
                for(let i=0; i<ChatFiles.length; i++){
                    const file = ChatFiles[i]
                    if(file.file_type.slice(0,5) === 'image'){
                        chatImageFiles.innerHTML += ` <div class="col-4 px-1 mb-2 chatImageContainerFile">
                               <a href="javascript:void(0)" onclick=previewImage("${file.file_url}")>
                        <img src="${file.file_url}" alt="-img" class="rounded" />
                        </a>
                              </div>`
                    }else{
                        otherFiles.innerHTML += `   <a href="/item?url=${file.file_url}" class="hstack gap-3 file-chat-hover justify-content-between text-nowrap" target=_blank>
                                <div class="d-flex align-items-center gap-3">
                                  <div class="rounded-1 text-bg-light p-6">
                                    <img src="/css/attachment.png" alt="${file.file_name}" width="24" height="24" />
                                  </div>
                                  <div>
                                    <h6 class="fw-semibold">${file.file_name}</h6>
                                    <div class="d-flex align-items-center gap-3 fs-2 text-muted">
                                      <span>${file.file_size}</span>
                                      <span>${formatTimestamp(file.date_sent)}</span>
                                    </div>
                                  </div>
                                </div>
                                <span class="position-relative nav-icon-hover download-file">
                                  <i class="ti ti-download text-dark fs-6 bg-hover-primary"></i>
                                </span>
                              </a>`
                    }
                }
            }else{
                chatImageFiles.innerHTML = "<h3>No files available</h3>"
            }
        }else{
            chatImageFiles.innerHTML = data.error
        }
    })
}