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

current_time = 1;
function createData() {
  const min = 0;
  const max = 5;
  let data = {
    graph_data: Number,
    time: Number,
  };

  let temp = +(Math.random() * (max - min + 1) + min).toFixed(2);
  data.graph_data = temp;
  data.time = current_time;
  ++current_time;
  return data;
}

var graph;

io.on("connection", (socket) => {
  console.log("a user has connected: ", socket.id);

  socket.on("startGraph", () => {
    console.log("Starting graph");
    graph = setInterval(sendData, 250);
  });

  socket.on("stopGraph", () => {
    console.log("Stopping graph");
    clearInterval(graph);
  });

  function sendData() {
    let data = createData();
    socket.emit("graphData", data);
    console.log(data.graph_data);
    console.log(data.time);
  }
});
