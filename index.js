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
  } else if (d === 2) {
    if (clientData[socketID].currentIndex >= dataset2.length) {
      clientData[socketID].currentIndex = 0;
    }
    temp = dataset2[clientData[socketID].currentIndex];
  }
  ++clientData[socketID].totalIndex;
  ++clientData[socketID].currentIndex;
  data.time = clientData[socketID].totalIndex;
  data.graph_data = temp;
  return data;
}

var clientData = {};

const dataset1 = [3, 3, 4, 3, 2, 7, 1, 3, 3, 4, 3, 3];
const dataset2 = [
  -0.13,
  -0.18,
  -0.13,
  -0.25,
  -0.26,
  -0.5,
  0.89,
  -0.43,
  -0.34,
  -0.33,
  -0.34,
  -0.33,
  -0.34,
  -0.33,
  -0.34,
  -0.33,
  -0.37,
  -0.33,
  -0.32,
  -0.31,
  -0.2,
  -0.23,
  -0.24,
  -0.25,
  -0.24,
];

var graph;

io.on("connection", (socket) => {
  console.log("a user has connected: ", socket.id);

  // Default client data
  clientData[socket.id] = {
    currentIndex: 0,
    totalIndex: 0,
    dataset: "random",
    graphingType: "normal",
    isOn: false,
    socketCounter: 0,
  };

  socket.on("graphOptions", (data) => {
    console.log(data.dataset);
    console.log(data.graphingType);

    clientData[socket.id].dataset = data.dataset;
    clientData[socket.id].graphingType = data.graphingType;
    clientData[socket.id].currentIndex = 0;
    clientData[socket.id].totalIndex = 0;
  });

  socket.on("startGraph", () => {
    // Only allows user to start graph if it is not currently active
    if (clientData[socket.id].isOn === false) {
      console.log("Starting graph");
      clientData[socket.id].isOn = true;
      graph = setInterval(() => {
        sendData(socket.id);
      }, 100);
    }
  });

  socket.on("stopGraph", () => {
    console.log("Stopping graph");
    stopGraph();

    console.log(clientData);
  });

  // Renews data stream timer
  socket.on("renewChannel", () => {
    clientData[socket.id].socketCounter = 0;
  });

  socket.on("disconnect", (reason) => {
    clientData[socket.id].isOn = false;
    clearInterval(graph);
  });

  function sendData(socketID) {
    console.log(clientData[socketID].socketCounter);
    if (clientData[socketID].socketCounter >= 10) {
      stopGraph();
    }
    if (clientData[socketID].dataset === "random") {
      var data = createData(0, socketID);
    } else if (clientData[socketID].dataset === "dataset1") {
      var data = createData(1, socketID);
    } else if (clientData[socketID].dataset === "dataset2") {
      var data = createData(2, socketID);
    }

    ++clientData[socketID].socketCounter;
    socket.emit("graphData", data);
    console.log("Data: ", data.graph_data);
    console.log("Time: ", data.time);
  }

  function stopGraph() {
    clearInterval(graph);
    clientData[socket.id].isOn = false;
  }
});
