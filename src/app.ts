import http, { createServer } from 'http';
import { initializeWebSocket } from "./models/socket";
import { config } from './configs/config_loader'
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
import path from 'path';

// Config server
const clientPort = config.port;
const app = express();
const server = createServer(app);

// Setting up server
initializeWebSocket(server, config.client_pass, config.frontend_pass);

// Setting up routes
app.use(express.json());
app.use(express.static(config.publicPath));

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