const http = require('http');
const { Server } = require('socket.io');
const express = require('express');

// Config server
const clientPort = 3000;
const app = express();

// Setting up routes
app.use(express.static("public"));

// Setting up socket
const server = http.createServer(app);
const clientIO = new Server(server);

// Start the servers
server.listen(clientPort, () => console.log(`Client server listening on port: ${clientPort}`));