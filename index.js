const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();
const port = process.env.PORT || 4500;

const server = http.createServer(app);

const users = [{}];
app.use(cors());
app.get("/", (req, res) => {
  res.send("Welcome to Backend!");
});

const io = socketIO(server);

io.on("connection", (socket) => {
  console.log("New Connection");

  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    console.log(`${user} has joined`);
    
    socket.broadcast.emit("userJoined", {
      user: "admin:",
      message: `${users[socket.id]} has joined`,
    });
    
    socket.emit("welcome", {
      user: "Admin",
      message: `Welcome to the chat, ${users[socket.id]}`,
    });
  });

  socket.on('message', ({message, id}) => {
    io.emit('sendMessage', {user:users[id], message, id});
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('left', {user: 'admin:', message: `${users[socket.id]} has left!`})
    console.log(`${users[socket.id]} left!`);
  })
});

server.listen(port, () => {
  console.log(`server is working on http://localhost:${port}`);
});
