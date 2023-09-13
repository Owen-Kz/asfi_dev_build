const express = require("express");
const db = require("./routes/db.config");
const dotenv = require("dotenv").config();

const app =  express();
const cookie = require("cookie-parser");
const PORT = process.env.PORT || 2000;
const server = require("http").Server(app)
const session = require("express-session");
const shortid = require("shortid");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const MySQLStore = require('express-mysql-session')(session);


const io = require("socket.io")(server, {
    port: 5000 // Change this to your desired port number
  })

  app.use(bodyParser.json());
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

app.set("views", ["./views", "./public/Tutorials/VideoInterface", "./public/directory/profile", "./public/", "./public/userUpload/books", "./public/directory", "./public/userUpload/audio"]);


app.use("/api/userFollows", require( "./controllers/userFollows"))
app.use("/api/directoryQuery", require("./controllers/directory"))

app.use("/css", express.static(__dirname + "/public/css", { type: 'text/css' }))
app.use("/js", express.static(__dirname + "/public/js", { type: 'text/javascript' }))
app.use("/vendor", express.static(__dirname + "/public/vendor", {type: 'text/javacript'}))
app.use("/js/bootstrap", express.static(__dirname + "/public/js/bootstrap/dist/js", {type:"text/javascript"}))

// app.use("/css/icons/font-awesome/css/", express.static(__dirname + "/public/css/icons/font-awesome/css/", {type : 'text/css'}))
app.use("/files", express.static(__dirname + "/public/files", {type: 'text/folder'}))
app.use("/files/images", express.static(__dirname + "/public/files/images", {type: 'file/image'}))
app.use("/userUploads/Audio", express.static(__dirname + "/public/userUpload/audio", {type:'file/media'}))
app.use("/userUploads/Videos", express.static(__dirname + "/public/userUpload/videos", {type:'file/media'}))
app.use("/userUploads/profileImages", express.static(__dirname + "/public/userUpload/profilePhotos", {type:'file/images'}))
app.use("/userUploads/profileCovers", express.static(__dirname +"/public/userUpload/profileCovers", {type:'file/images'}))
app.use("/userUploads/spaceCovers", express.static(__dirname +"/public/userUpload/spaceCovers", {type:'file/images'}))

app.use("/userUploads/thumbnails", express.static(__dirname + "/public/userUpload/thumbnails", {type: 'file/image'}))
app.use("/js/instructorControls", express.static(__dirname + "/public/js/instructorControls", {type:"text/javascript"}))
// app.use("/library/books", express.static(__dirname + "/public/userUpload/books", {type: 'file/pdf'}))




app.use("/directory", express.static(__dirname + "/public/Directory"))

db.connect((err) => {
    if(err) throw err;
    console.log("Database connected");
})

let socketsConnected = new Set();

io.on('connection', onConnected);

function onConnected(socket) {
  // console.log('Socket connected', socket.id);
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
  // console.log(roomId)
  })

  socket.on("message", async (data, roomId, userId) => {
    const recipientId = data.receiver;
    const content = data.message;
    const senderId = data.name;
    const timestamp = data.dateTime;
  
    // const buffer_unique =  `${recipientId + senderId}`;
    // const buffer_id = await bcrypt.hash(buffer_unique, 8)
    const buffer_id = data.inbox

    const query = "INSERT INTO messages (sender_id, recipient_id, content, timestamp, buffer) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [senderId, recipientId, content, timestamp, buffer_id], (err, results) => {
      if (err) {
        console.error("Error saving message to the database:", err);
      } else {
        // Emit the message only to the users in the same room
        io.to(roomId).emit("chat-message", data);
      }
    });
  });

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });

  // SOCKET IO CODE FOR THE VIDEO CONFERENCING
  socket.on('join-vc', (roomId_vc, userId_vc) => {
    socket.join(roomId_vc);
    console.log(roomId_vc)
    socket.to(roomId_vc).broadcast.emit('user-connected-vc', userId_vc);

    socket.on('disconnect_vc', () => {
      socket.to(roomId_vc).broadcast.emit('user-disconnected-vc', userId_vc);
    });
  });
}
app.use("/", require("./routes/pages"));
app.use("/api", require("./controllers/auth"));
app.use("/api/createFollower", require("./controllers/createFollower"));
app.use("/api/delFollower", require("./controllers/deleteFollower"));
app.use("/api/scholar/createPodcast", require("./controllers/scholarContols/createPodcast"));
// app.use("/api/scholar/newCourse", require("./controllers/scholarContols/createCourse"))
app.use("/api/updateAccount", require("./controllers/updateAccount"));
app.use("/api/updateLinks", require("./controllers/createLink"))
app.use("/api/data", require("./controllers/PodcastDownload"));
app.use("/api/join-Room", require("./controllers/joinRoom"));
app.use("/api/confirm-code", require("./controllers/confirmReset"));
app.use("/create/newInstructor", require("./controllers/InstructorControls/createInstructor"));
app.use("/api/uploadBooks/set", require("./controllers/scholarContols/uploadBook"))
app.use("/update/newPasword", require("./controllers/updatePassword"))


server.listen(PORT);