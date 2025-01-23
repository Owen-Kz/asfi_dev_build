import { formatTimestamp } from "./chat/formatTime.js";
import { getUserData } from "./searchQueries/getUserInfo.js";

// ADD RECENT MESSAGES
async function Recents() {
  try {
    const response = await fetch(`/recentChatList`, { method: "POST" });
    const data = await response.json();
    return data.success ? data.recent : [];
  } catch (error) {
    console.error("Error fetching recent chats:", error);
    return [];
  }
}



const RecentChatList = document.getElementById("active_conversations");
const chatListMobile = document.getElementById("active_conversation")
const RecentCountContainer = document.getElementById("c-number");

(async function () {
  const RecentMessage = await Recents();

  if (RecentMessage.length > 0) {
    RecentCountContainer.innerText = RecentMessage.length;

    // Fetch user data for all chats in parallel
    const userDataPromises = RecentMessage.map(async (recentChat) => {
      const sender = await getUserData(recentChat.SentBy);
      const recipient = await getUserData(recentChat.Receiver);
      return { recentChat, sender, recipient };
    });

    const chatData = await Promise.all(userDataPromises);

    // Append each chat to the DOM
    chatData.forEach(({ recentChat, sender, recipient }) => {
      const { LastMessage, Receiver, SentBy, TimeStamp, mainUser } = recentChat;

      let ActualSender, ActualReceiver, ActualSenderText, ActualSenderProfile;

      if (Receiver === mainUser) {
        ActualSender = `${sender.first_name} ${sender.last_name}`;
        ActualSenderText = `@${sender.username}`;
        ActualReceiver = "You";
        ActualSenderProfile = sender.profile_picture
      } else {
        ActualSender = `${recipient.first_name} ${recipient.last_name}`;
        ActualSenderText = `@${recipient.username}`;
        ActualReceiver = `${recipient.first_name} ${recipient.last_name}`;
        ActualSenderProfile = recipient.profile_picture
      }

      if (SentBy === mainUser && Receiver === mainUser) {
        ActualSenderText = "Note To Self";
      }

      const formattedMessageTimestamp = formatTimestamp(new Date(TimeStamp));
      let senderImage = ""

      if(ActualSenderProfile !== "avatar.jpg"){
        senderImage = ActualSenderProfile
      }else{
        senderImage = 'https://res.cloudinary.com/dll8awuig/image/upload/v1705444097/dc69h8mggh01bvlvbowh.jpg'
      }
      const content = `  <li>
          <a href="javascript:void(0)" class="px-4 py-3 bg-hover-light-black d-flex align-items-start justify-content-between chat-user" onclick=UpdateChatUI("${recentChat.buffer}")>
            <div class="d-flex align-items-center">
              <span class="position-relative rounded-circle">
                <img src="${senderImage}" alt="user-profile" width="48" height="48" />
              </span>
              <div class="ms-3 d-inline-block w-75">
                <h6 class="mb-1 fw-semibold chat-title" data-username="${ActualSenderText}">
                  ${ActualSender}
                </h6>
                <span class="fs-3 text-truncate text-dark d-block">${LastMessage}</span>
              </div>
            </div>
            <p class="fs-2 mb-0 text-muted">${formattedMessageTimestamp}</p>
          </a>
        </li>
      `
      RecentChatList.innerHTML += content
      if(chatListMobile){
        chatListMobile.innerHTML += `  <li>
          <a href="javascript:void(0)" class="px-4 py-3 bg-hover-light-black d-flex align-items-start justify-content-between chat-user" onclick=UpdateChatUI("${recentChat.buffer}")>
            <div class="d-flex align-items-center">
              <span class="position-relative rounded-circle">
                <img src="${senderImage}" alt="user-profile" width="48" height="48" />
              </span>
              <div class="ms-3 d-inline-block w-75">
                <h6 class="mb-1 fw-semibold chat-title" data-username="${ActualSenderText}">
                  ${ActualSender}
                </h6>
                <span class="fs-3 text-truncate text-dark d-block">${LastMessage}</span>
              </div>
            </div>
            <p class="fs-2 mb-0 text-muted">${formattedMessageTimestamp}</p>
          </a>
        </li>
      `
      }
      ;
    });

    // Truncate long message content
    const limitedTextElements = RecentChatList.querySelectorAll(".fs-3.text-truncate");
    const maxLength = 15;

    limitedTextElements.forEach((element) => {
      if (element.innerText.length > maxLength) {
        element.innerText = element.innerText.substring(0, maxLength) + "...";
      }
    });
  }
})();
