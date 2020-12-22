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

function createData() {
  const num_of_data = 10;
  const min = 0;
  const max = 5;
  var data = [];

  for (let index = 0; index < num_of_data; index++) {
    let temp = Math.random() * (max - min + 1) + min;
    data.push(temp);
  }
  return data;
}

io.on("connection", (socket) => {
  console.log("a user has connected");

  let data = createData();
  io.sockets.emit("graphData", data);
});
