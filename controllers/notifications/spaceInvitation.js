const sendBody = require("./sendBody")

const spaceInvitationNotification = async (spaceName, token) =>{
    const data = {
        title: `Space Invitation`,
        message: `You were invited to join ${spaceName} by`,
        token:token,
    }
    await sendBody(data)
}

module.exports  = spaceInvitationNotification