const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketio(server);
//define paths for Express config
const publicPath = path.join(__dirname, "../public");

//setup static directory to serve
app.use(express.static(publicPath));

io.on("connection", (socket) => {
  console.log("New websocket connection");
  socket.emit("message", "welcome");
  socket.broadcast.emit("message", "a new user has joined");

  socket.on("sendMessage", (message) => {
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user has left");
  });
});

server.listen(port, () => {
  console.log("Server is up on port " + port);
});
