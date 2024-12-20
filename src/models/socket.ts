import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { plainToInstance } from 'class-transformer';
import { ActionDTO, ButtonActionTypes, ButtonsDTO, PresetDTO } from '../interfaces/preset';
import { getPresetById } from './preset'
import { keys } from '../configs/config_loader'

// Object to store connected clients (clientID: socket object)
interface ConnectedClients {
    [key: string]: any
}
let connectedClients: ConnectedClients = {};

// Socket init
let clientIO: Server;
enum SocketRoom {
    STATUSES = "statuses",
    INIT_FRONT = "init",
    SEND_COMMAND = 'command-cli'
}

const getCommand = (type: ButtonActionTypes, action: string) => `${type}:${action}`;

// Init web sockt
export const initializeWebSocket = (server: HttpServer, clientPassword: string, frontEndPassword: string) => {
    clientIO = new Server(server, {
        cors: {
            origin: '*',
        },
    });

    clientIO.on('connection', (clientSocket) => {
        const clientType = clientSocket.handshake.query?.type;
        const password = clientSocket.handshake.query?.password;

        // Check client type
        switch (clientType) {
            // If we connect client
            case 'client':
                if (password != clientPassword) {
                    clientSocket.disconnect();
                    return;
                }
                console.log('Client connected: ', clientSocket.handshake.address);
                connectedClients[clientSocket.handshake.address] = clientSocket;
                clientIO.emit(SocketRoom.STATUSES, Object.keys(connectedClients));
                break;

            // If we connect frontend
            case 'frontend':
                if (password != frontEndPassword) {
                    clientSocket.disconnect();
                    return;
                }
                console.log('Front-end: ', clientSocket.handshake.address);
                clientSocket.emit(SocketRoom.INIT_FRONT, Object.keys(connectedClients));
                break;
            // Default
            default:
                clientSocket.disconnect();
                return;
                break;
        }

        // Handle client disconnection
        clientSocket.on('disconnect', () => {
            const disconnectedID = Object.keys(connectedClients).find(
                (id) => connectedClients[id] === clientSocket
            );

            if (disconnectedID) {
                delete connectedClients[disconnectedID];
                clientIO.emit(SocketRoom.STATUSES, Object.keys(connectedClients));
            }
        });
    });
};

/**
 * Send action to socket clients
 * @param params 
 */
export async function sendAction(params: ActionDTO) {
    let command: string;

    try {
        // Get preset from database
        const preset = plainToInstance(PresetDTO, await getPresetById(params.presetId));
        if (!preset) return;

        // Search button in preset buttons
        const button = plainToInstance(ButtonsDTO, preset.buttons.filter(button => button.name == params.buttonName)[0]);
        if (!button) return;

        // Get command from commands json
        switch (button.type) {
            case ButtonActionTypes.press:
                command = getCommand(button.type, keys[button.action].label);
                break;
            case ButtonActionTypes.open:
                command = getCommand(button.type, button.action);
                break;
            default:
                return;
        }

        // Send command to all clients
        params.emitClients.forEach(client => {
            console.log(`${command} -> ${client}`);

            // Search client in list
            const clientId = Object.keys(connectedClients).find(
                (id) => id === client
            );

            // If client id founded
            if (clientId) {
                if (clientIO)
                    clientIO.emit(SocketRoom.SEND_COMMAND, command);
                else
                    console.error('WebSocket server not initialized');
            }
        });
    }
    catch (e) {
        console.log(e);
    }
}
