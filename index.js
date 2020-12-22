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

current_time = 0;
function createData() {
  const num_of_data = 10;
  const min = 0;
  const max = 5;
  var data = {
    graph_data: [],
    time: [],
  };

  for (let index = 0; index < num_of_data; index++) {
    let temp = +(Math.random() * (max - min + 1) + min).toFixed(2);
    data.graph_data.push(temp);
    data.time.push(current_time);
    ++current_time;
  }
  return data;
}

io.on("connection", (socket) => {
  console.log("a user has connected");

  setInterval(sendData, 5000);
});

function sendData() {
  let data = createData();
  io.sockets.emit("graphData", data);
  console.log(data.graph_data);
  console.log(data.time);
}
