const socket = io('/')

socket.emit('join-room', ROOM_ID, 1)

socket.on('user-connected', userId => {
    console.log("User connected :", userId)
})