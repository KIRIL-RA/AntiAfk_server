import dotenv from "dotenv";
dotenv.config();
import http from 'http';
import { Server } from 'socket.io';
import express  from 'express';

// Import routes
import createPreset from "./routes/add_preset"
import getAllPresets from "./routes/get_all_presets"
import getPreset from "./routes/get_preset"

import createClient from "./routes/add_client_name"
import getClient from "./routes/get_client"
import updateClient from "./routes/update_client"

// Config server
const clientPort = 3000;
const app = express();

// Setting up routes
app.use(express.json());
app.use(express.static("public"));

app.use(createPreset);
app.use(getAllPresets);
app.use(getPreset);

app.use(createClient);
app.use(getClient);
app.use(updateClient);

// Setting up socket
const server = http.createServer(app);
const clientIO = new Server(server);

// Start the servers
server.listen(clientPort, () => console.log(`Client server listening on port: ${clientPort}`));