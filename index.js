const express = require("express");
const socket = require("socket.io");

// App setup
const app = express();
const PORT = 7070;
const server = app.listen(PORT, function () {
  console.log("Listening to requests on " + PORT);
});

// Socket setup
const io = socket(server); //What server to work with

io.on("connection", (socket) => {
  console.log("a user has connected");
});
