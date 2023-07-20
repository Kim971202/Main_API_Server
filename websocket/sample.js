const WebSocket = require("ws");
const socket = new WebSocket("ws://localhost:7773/connect");

// Open the socket
socket.onopen = function (event) {
  // Send an initial message
  socket.send(`
  {
    "header": {
      "protocolVer": "v1.1.1",
      "messageFlag": "NORMAL",
      "payloadType": "JSON",
      "functionID": "OptionInfoSet",
      "sourceID": "0000010105010001",
      "destinationID": "0000000000000200",
      "transactionID": "4182b34d-e786-4e6d-812a-c72e03a01672",
      "accessToken": "44c880df-701b-46e1-8d7b-964f087c42bc"
    },
    "resultCode": "OK"
  }`);

  // Listen for messages
  socket.onmessage = function (event) {
    console.log("Client received a message: ", event.data);
  };

  // Listen for socket closes
  socket.onclose = function (event) {
    console.log("Client notified socket has closed", event._eventsCount);
  };

  // To close the socket....
  socket.close();
};
