const sendBody = require("./sendBody")

const sendNewFollowerNotification = async (follower, token) =>{
    const data = {
        title: `You have a new follower`,
        message: `${follower} just started following you`,
        token:token,
    }
    await sendBody(data)
}

module.exports  = sendNewFollowerNotification