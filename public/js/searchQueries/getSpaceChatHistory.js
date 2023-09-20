const SpaceId = document.getElementById("SpaceID").value
const ChatArray = document.getElementById("chatHistory")

getChatHistory()
function getChatHistory(spaceId) {
    return fetch(`/getSpaceChatHistory/${spaceId}`, {
        method: "GET"
    })
    .then(res => res.json())
    .then(data => {
        const spaceChatFromDB = JSON.parse(data.spaceChatHistory);
        if (spaceChatFromDB.length > 0) {
            return data.spaceChatHistory;
        } else {
            return null;
        }
    });
}
