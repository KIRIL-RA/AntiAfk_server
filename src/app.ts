import http, { createServer } from 'http';
import { initializeWebSocket } from "./models/socket";
import { config } from './configs/config_loader'
import express  from 'express';

// Import routes
import createPreset from "./routes/preset_handlers/add_preset"
import getAllPresets from "./routes/preset_handlers/get_all_presets"
import getPreset from "./routes/preset_handlers/get_preset"
import getKeys from "./routes/preset_handlers/get_keys_for_presets"
import addProcessPreset from "./routes/preset_handlers/add_process_preset"
import deletePresetRoute from './routes/preset_handlers/delete_preset';

import createClient from "./routes/client_handlers/add_client_name"
import getClient from "./routes/client_handlers/get_client"

import sendAction from "./routes/action_handlers/send_action"
import sendButton from "./routes/action_handlers/send_button"

import uploadFile from "./routes/fileHandlers/upload";
import getFile from "./routes/fileHandlers/get_file";

// Config server
const clientPort = config.port;
const app = express();
const server = createServer(app);

// Setting up server
initializeWebSocket(server, config.client_pass, config.frontend_pass);

// Setting up routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(config.publicPath));

app.use(createPreset);
app.use(getAllPresets);
app.use(getPreset);
app.use(getKeys);
app.use(addProcessPreset);
app.use(deletePresetRoute);

app.use(createClient);
app.use(getClient);

app.use(sendAction);
app.use(sendButton);

app.use(uploadFile);
app.use(getFile);

// Start the servers
server.listen(clientPort, () => console.log(`Client server listening on port: ${clientPort}`));