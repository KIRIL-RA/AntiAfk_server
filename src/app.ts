import dotenv from "dotenv";
dotenv.config();
import http, { createServer } from 'http';
import { initializeWebSocket } from "./models/socket";
import express  from 'express';

// Import routes
import createPreset from "./routes/preset_handlers/add_preset"
import getAllPresets from "./routes/preset_handlers/get_all_presets"
import getPreset from "./routes/preset_handlers/get_preset"

import createClient from "./routes/client_handlers/add_client_name"
import getClient from "./routes/client_handlers/get_client"
import updateClient from "./routes/client_handlers/update_client"

import sendAction from "./routes/action_handlers/send_action"

// Config server
const clientPort = 3000;
const app = express();
const server = createServer(app);

// Setting up server
initializeWebSocket(server, 'passwd', 'passwd');

// Setting up routes
app.use(express.json());
app.use(express.static("public"));

app.use(createPreset);
app.use(getAllPresets);
app.use(getPreset);

app.use(createClient);
app.use(getClient);
app.use(updateClient);

app.use(sendAction);

// Start the servers
server.listen(clientPort, () => console.log(`Client server listening on port: ${clientPort}`));