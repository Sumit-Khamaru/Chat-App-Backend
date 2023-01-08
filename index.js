const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const socket = require('socket.io');


const app = express();
require("dotenv").config();

app.use(cors({origin:true}))
app.use(cookieParser());
app.use(bodyParser.json());

const PORT = process.env.PORT;



// Import the routes
const user = require("./routes/usersRoutes");
const msg = require("./routes/messagesRoute");

// using The Routes
app.use("/api/auth", user);
app.use("/api/messages", msg);


mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((con) => {
  console.log(`Database is Connected: ${con.connection.host}`);
}).catch((err) => {
  console.log(err.message);
});


const server = app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`)
})


const io = socket(server, {
  cors:{
    origin: ['https://cchat-app.onrender.com'],
    credentials: true,
  },
});

//The onlineUsers map is a global variable that is being used to store the mapping of user IDs to socket IDs for all connected clients. When a client connects, the add-user event is emitted and the userId and socket.id are added to the map.
 global.onlineUsers = new Map();

 io.on('connection', (socket) => {
    global.chatSocket = socket;

    socket.on('add-user', (userId) => {
      onlineUsers.set(userId, socket.id);
    })


    socket.on('send-msg', (data) => {
      const sendUserSocket = onlineUsers.get(data.to);

      if(sendUserSocket) {
        socket.to(sendUserSocket).emit('msg-receive', data.message);
      }
    })
 })