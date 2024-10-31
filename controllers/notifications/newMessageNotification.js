const sendBody = require("./sendBody")

const sendNewMessageNotification = async (user, token) =>{
    const data = {
        title: `You have a New Meesage`,
        message: `${user} just sent you a message`,
        token:token,
    }
    await sendBody(data)
}

module.exports  = sendNewMessageNotification