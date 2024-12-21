import dotenv from "dotenv";
dotenv.config();
import http, { createServer } from 'http';
import { initializeWebSocket } from "./models/socket";
import express  from 'express';

// Import routes
import createPreset from "./routes/preset_handlers/add_preset"
import getAllPresets from "./routes/preset_handlers/get_all_presets"
import getPreset from "./routes/preset_handlers/get_preset"
import getKeys from "./routes/preset_handlers/get_keys_for_presets"

import createClient from "./routes/client_handlers/add_client_name"
import getClient from "./routes/client_handlers/get_client"

import sendAction from "./routes/action_handlers/send_action"
import sendButton from "./routes/action_handlers/send_button"

// Config server
const clientPort = 3000;
const app = express();
const server = createServer(app);

// Setting up server
initializeWebSocket(server, 'passwd', process.env.GET_TOKEN || "passwd");

// Setting up routes
app.use(express.json());
app.use(express.static("src/public"));

app.use(createPreset);
app.use(getAllPresets);
app.use(getPreset);
app.use(getKeys);

app.use(createClient);
app.use(getClient);

app.use(sendAction);
app.use(sendButton);

// Start the servers
server.listen(clientPort, () => console.log(`Client server listening on port: ${clientPort}`));