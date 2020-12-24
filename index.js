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

function createData(d, socketID) {
  let data = {
    graph_data: Number,
    time: Number,
  };
  let temp;
  if (d === 0) {
    const min = 0;
    const max = 5;
    temp = +(Math.random() * (max - min + 1) + min).toFixed(2);
  } else if (d === 1) {
    if (clientData[socketID].currentIndex >= dataset1.length) {
      clientData[socketID].currentIndex = 0;
    }
    temp = dataset1[clientData[socketID].currentIndex];
  }
  ++clientData[socketID].currentIndex;
  data.graph_data = temp;
  data.time = clientData[socketID].currentIndex;
  return data;
}

var clientData = {};

const dataset1 = [3, 3, 3, 4, 3, 2, 7, 1, 3, 3, 4, 3, 3, 3];

var graph;

io.on("connection", (socket) => {
  console.log("a user has connected: ", socket.id);

  // Default client data
  clientData[socket.id] = {
    currentIndex: 0,
    dataset: "random",
    graphingType: "normal",
    isOn: false,
  };

  socket.on("graphOptions", (data) => {
    console.log(data.dataset);
    console.log(data.graphingType);

    clientData[socket.id].dataset = data.dataset;
    clientData[socket.id].graphingType = data.graphingType;
    clientData[socket.id].currentIndex = 0;
  });

  socket.on("startGraph", () => {
    // Only allows user to start graph if it is not currently active
    if (clientData[socket.id].isOn === false) {
      console.log("Starting graph");
      clientData[socket.id].isOn = true;
      graph = setInterval(() => {
        sendData(socket.id);
      }, 250);
    }
  });

  socket.on("stopGraph", () => {
    console.log("Stopping graph");
    clientData[socket.id].isOn = false;
    clearInterval(graph);

    console.log(clientData);
  });

  socket.on("disconnect", (reason) => {
    clientData[socket.id].isOn = false;
    clearInterval(graph);
  });

  function sendData(socketID) {
    if (clientData[socketID].dataset === "random") {
      var data = createData(0, socketID);
    } else if (clientData[socketID].dataset === "dataset1") {
      var data = createData(1, socketID);
    }

    socket.emit("graphData", data);
    console.log("Data: ", data.graph_data);
    console.log("Time: ", data.time);
  }
});
