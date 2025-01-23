const express = require("express");
const db = require("./routes/db.config");
const dotenv = require("dotenv").config();

const app =  express();
const cookie = require("cookie-parser");
const PORT = process.env.PORT || 31000;
const server = require("http").Server(app)
const session = require("express-session");
const shortid = require("shortid");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const LoggedIn = require("./controllers/loggedin");
const MySQLStore = require('express-mysql-session')(session);

const webpush = require('web-push');
const path = require("path");
const findUserByName = require("./controllers/services/findUser");
const sendNewMessageNotification = require("./controllers/notifications/newMessageNotification");
const generateID = require("./controllers/admin/generateId");
const saveNotification = require("./controllers/scholarContols/saveNotification");

// Generate VAPID keys
// const vapidKeys = webpush.generateVAPIDKeys();

// console.log(vapidKeys) 
// webpush.setVapidDetails(
//   'mailto:owen@weperch.live',
//   process.env.VAPID_PUBLIC_KEY,
//   process.env.VAPID_PRIVATE_KEY
// );

const {Server} = require('socket.io');
require('debug')('socket.io');

// socketIo.Server
// const io = new Server(server, {
//   cors: {
//     origin: '*', // Update with your actual origin
//     methods: ["GET", "POST"],
// },
// transports: ["websocket"],
// });


const io = require('socket.io')(server, {
  cors: {
      origin: "https://asfischolar.org",
      methods: ["GET", "POST"]
  },
transports: ["websocket"], 
});


// const io = require("socket.io")(server, {
//     port: 37400 // Change this to your desired port number
//   })
// const io = require("socket.io")(server, {
//   pingTimeout: 60000, // Wait 60 seconds before assuming the connection is lost
//   pingInterval: 25000, // Send a ping every 25 seconds
// });


// const io = require("socket.io")(server, {
//   transports: ["websocket"], // WebSocket-only
// });
 
  app.use(bodyParser.json());
//   app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.urlencoded({ extended: true }));
app.use(cookie());
app.use(express.json());

// Configure the session store
const sessionStore = new MySQLStore({
  host: process.env.DATABASE_HOST,
  port: '3306',
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});


app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
}));

app.set("view engine", "ejs");

app.set("views", ["./views", "./views/admin", "./public/directory/profile", "./public/", "./public/userUpload/books", "./public/directory", "./public/userUpload/audio"]);


app.get("/api/userFollows",LoggedIn, require( "./controllers/userFollows"))

app.use("/api/directoryQuery", require("./controllers/directory"))

app.use("/public", express.static(path.join(__dirname, "public")));


app.use("/css", express.static(__dirname + "/public/css", { type: 'text/css' }))
app.use("/js", express.static(__dirname + "/public/js", { type: 'text/javascript' }))
app.use("/vendor", express.static(__dirname + "/public/vendor", {type: 'text/javacript'}))
app.use("/js/bootstrap", express.static(__dirname + "/public/js/bootstrap/dist/js", {type:"text/javascript"}))
app.use("/assets", express.static(__dirname + "/public/assets/", { type: 'text/folder' }))

app.use("/chatAssets", express.static(__dirname + "/public/chatAssets", { type: 'text/folder' }))

app.use("/assets/images", express.static(__dirname + "/public//assets/images", {type: 'text/folder'}))
// app.use("/css/icons/font-awesome/css/", express.static(__dirname + "/public/css/icons/font-awesome/css/", {type : 'text/css'}))
app.use("/files", express.static(__dirname + "/public/files", {type: 'text/folder'}))
app.use("/files/images", express.static(__dirname + "/public/files/images", {type: 'file/image'}))
app.use("/userUploads/Audio", express.static(__dirname + "/public/userUpload/audio", {type:'file/media'}))
app.use("/userUploads/Videos", express.static(__dirname + "/public/userUpload/videos", {type:'file/media'}))
app.use("/userUploads/profileImages", express.static(__dirname + "/public/userUpload/profilePhotos", {type:'file/images'}))
app.use("/userUploads/profileCovers", express.static(__dirname +"/public/userUpload/profileCovers", {type:'file/images'}))
// app.use("/userUploads/spaceCovers", express.static(__dirname +"/public/userUpload/spaceCovers", {type:'file/images'}))
// app.use("/files/images", express.static(__dirname + "/public/images", { type: 'file/images' }))

app.use("/userUploads/thumbnails", express.static(__dirname + "/public/userUpload/thumbnails", {type: 'file/image'}))
app.use("/js/instructorControls", express.static(__dirname + "/public/js/instructorControls", {type:"text/javascript"}))
// app.use("/library/books", express.static(__dirname + "/public/userUpload/books", {type: 'file/pdf'}))




app.use("/directory", express.static(__dirname + "/public/Directory"))

db.connect((err) => {
    if(err) throw err;
    console.log(`Database connected and server running on ${PORT}`);
})

let socketsConnected = new Set();

io.on('connection', onConnected);

function onConnected(socket) {
  console.log('Socket connected', socket.id);
  socketsConnected.add(socket.id);
  io.emit('clients-total', socketsConnected.size);

  socket.on('disconnect', () => {
    // console.log('Socket disconnected', socket.id); 
    socketsConnected.delete(socket.id); 
    io.emit('clients-total', socketsConnected.size);
  });

  // Generate a unique room ID for this pair of users
  // const roomId_ = shortid.generate();
  
  socket.on("join-room", async (roomId, userId) =>{
    socket.join(roomId); // Join the room
  // console.log("join",roomId) 
  })
 
  socket.on("message", async (data, roomId, userId) => {
    const recipientId = data.receiver;
    const content = data.message; 
    const senderId = data.name;
    const timestamp = data.dateTime;
  
    const buffer_id = data.inbox
    const messageId = await generateID()

    const files = data.files



   
     
    // chatId, text, receiver, timestamp
    if(files[0]){
    
    }else{
    const query = "INSERT INTO messages (sender_id, recipient_id, content, timestamp, buffer, message_id) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(query, [senderId, recipientId, content, timestamp, buffer_id, messageId], async (err, results) => {
      if (err) {
        console.error("Error saving message to the database:", err);
      } 
    });
    }
        
        const userData = await findUserByName(recipientId)
        const notificationToken = userData.notification_token
        let userPhoto = ""
        // if(req.user.profile_picture && req.user.profile_picture != "avatar.jpg" && req.user.profile_picture != null ){
        //   userPhoto = req.user.profile_picture
        // }else{
          userPhoto = "https://res.cloudinary.com/dll8awuig/image/upload/v1705444097/dc69h8mggh01bvlvbowh.jpg"
        // }
        const Endpoint = `/@${senderId}/chat`
        await saveNotification(senderId, recipientId, `New Message from ${senderId}. ${content}`, userPhoto, Endpoint)
        await sendNewMessageNotification(senderId, notificationToken)

   // Emit the message only to the users in the same room
   io.to(data.inbox).emit("chat-message", data);
  });

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });

  // THE SOCKET IO CHAT SYSTEM FOR SPACES GOES HERE
  socket.on('join-group-chat', async (roomId) => {
    socket.join(roomId); // Join the group chat room
  });

  socket.on('leave-group-chat', async (roomId) => {
    socket.leave(roomId); // Leave the group chat room
  });

  socket.on('group-chat-message', async (data, roomId) => {
    const content = data.message;
    const senderId = data.name;
    const timestamp = data.dateTime;

    const files = data.files

    // Save the message to the database with the group chat room ID
    const buffer_id = data.inbox
    const messageId = await generateID()

    if(files[0]){
    
    }else{
    const query = "INSERT INTO spaces_messages (sender_id, content, timestamp, buffer, message_id) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [senderId, content, timestamp, buffer_id, messageId], (err, results) => {
      if (err) {
        console.error("Error saving message to the database:", err);
      } else {
    // Emit the message to all users in the group chat
      }
    });
  }

  io.to(roomId).emit('group-chat-message', data);


  });

 
  // SOCKET IO CODE FOR THE VIDEO CONFERENCING
  socket.on('join-vc', (roomId_vc, userId_vc) => {
    socket.join(roomId_vc);

    socket.to(roomId_vc).broadcast.emit('user-connected-vc', userId_vc);

    socket.on('disconnect_vc', () => {
      socket.to(roomId_vc).broadcast.emit('user-disconnected-vc', userId_vc);
    });
  });
}

app.use("/", require("./routes/pages"));
app.use("/administrator", require("./routes/adminPages"));
app.use("/api", require("./controllers/auth"));
app.use("/api/createFollower", LoggedIn, require("./controllers/createFollower"));
app.use("/api/delFollower", require("./controllers/deleteFollower"));
app.use("/api/scholar/createPodcast", require("./controllers/scholarContols/createPodcast"));
// app.use("/api/scholar/newCourse", require("./controllers/scholarContols/createCourse"))
// app.use("/api/updateAccount", LoggedIn, require("./controllers/updateAccount"));
app.use("/api/updateLinks", require("./controllers/createLink"))
app.use("/api/data", require("./controllers/PodcastDownload"));
app.use("/api/join-Room", require("./controllers/joinRoom"));
app.use("/api/confirm-code", require("./controllers/confirmReset"));
app.use("/create/newInstructor", require("./controllers/InstructorControls/createInstructor"));
app.use("/api/uploadBooks/set", require("./controllers/scholarContols/uploadBook"))
app.use("/update/newPasword", require("./controllers/updatePassword"))

 
server.listen(PORT); 