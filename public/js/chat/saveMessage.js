const SaveMessage = async (data) => {
    try {
        const recipientId = data.receiver;
        const content = data.message;
        const senderId = data.name;
        const timestamp = data.dateTime;
    
        const buffer_id = data.inbox;

        const MessageData = {
            inbox: buffer_id,
            receiver: recipientId,
            name: senderId,
            dateTime: timestamp,

            message: content,
            recipient: recipientId,
            sender: senderId
        };

        const response = await fetch(`/y/saveMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(MessageData)
        });
        const responseData = await response.json();
        if (responseData.success) {
            return responseData; // resolve the promise with the response data
        } else {
            console.log(responseData.error)
            throw new Error(responseData.error); // reject the promise with an error
        }
    }catch(error){
        console.log("Error saving message:", error);
        return error
    }
}

// module.exports = SaveMessage