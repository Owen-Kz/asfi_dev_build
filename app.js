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

const fs = require("fs");
const WebSocket = require("ws");
const { spawn } = require("child_process");
const ffmpeg = require("fluent-ffmpeg");

const WEBSOCKET_PORT = 5000;
const RECORDINGS_DIR = "recordings";

// Ensure the recordings directory exists
if (!fs.existsSync(RECORDINGS_DIR)) {
    fs.mkdirSync(RECORDINGS_DIR);
}
const io = require('socket.io')(server, {
  cors: {
      origin: "https://asfischolar.org",
      methods: ["GET", "POST"]
  },
transports: ["websocket"], 
  pingTimeout: 60000, // Wait 60 seconds before assuming the connection is lost
  pingInterval: 25000, // Send a ping every 25 seconds
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
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));


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

app.use(express.static('public'));
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
app.use("/manuscripts", express.static(__dirname + "/controllers/temp"));
app.use("/recordings", express.static("recordings"));

db.connect((err) => {
    if(err) throw err;
    console.log(`Database connected and server running on ${PORT}`);
})



const WebSocketServer = new WebSocket.Server({ port: WEBSOCKET_PORT });

WebSocketServer.on("connection", (ws) => {
    console.log("Client connected, starting WebM recording...");

    const webmFilename = `${RECORDINGS_DIR}/meeting-${Date.now()}.webm`;
    const mp4Filename = webmFilename.replace(".webm", ".mp4");

    // Start FFmpeg process to save WebRTC stream as WebM
    const ffmpegProcess = spawn("ffmpeg", [
        "-y",
        "-i", "pipe:0",
        "-c:v", "libvpx",
        "-c:a", "libopus",
        webmFilename
    ]);

    ws.on("message", (data) => {
        ffmpegProcess.stdin.write(data); // Write stream data to FFmpeg
    });

    ws.on("close", () => {
        console.log("Client disconnected, stopping FFmpeg...");
        ffmpegProcess.stdin.end(); // Stop FFmpeg

        // Convert WebM to MP4 after recording stops
        ffmpeg(webmFilename)
            .output(mp4Filename)
            .videoCodec("libx264")
            .on("end", () => {
                console.log(`Conversion to MP4 complete: ${mp4Filename}`);
                fs.unlinkSync(webmFilename); // Remove WebM after conversion
            })
            .on("error", (err) => console.error("FFmpeg error:", err))
            .run();
    });
});

console.log(`WebSocket server running on ws://localhost:${WEBSOCKET_PORT}`);


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