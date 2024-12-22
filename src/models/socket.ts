import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { plainToInstance } from 'class-transformer';
import { ActionDTO, ButtonActionTypes, ButtonsDTO, PresetDTO, SendButtonClickDTO } from '../interfaces/preset';
import { getPresetById } from './preset'
import { keys } from '../configs/config_loader'
import { getClientByIp } from './client';
import { ClientDTO } from '../interfaces/clients';

// Object to store connected clients (clientID: socket object)
interface ConnectedClients {
    [key: string]: any
}
let connectedClients: ConnectedClients = {};
let connectedClientsDto : ClientDTO[] = [];

// Socket init
let clientIO: Server;
enum SocketRoom {
    STATUSES = "statuses",
    INIT_FRONT = "init",
    SEND_COMMAND = 'command-cli'
}

const getCommand = (type: ButtonActionTypes, action: string, repeats = 0) => `${type}|||${action}|||${repeats}`;

// Init web sockt
export const initializeWebSocket = (server: HttpServer, clientPassword: string, frontEndPassword: string) => {
    clientIO = new Server(server, {
        cors: {
            origin: '*',
        },
    });

    clientIO.on('connection', async (clientSocket) => {
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

                // Getting data bout client
                console.log('Client connected: ', clientSocket.handshake.address);
                connectedClients[clientSocket.handshake.address] = clientSocket;
                const clientData = await getClientByIp(clientSocket.handshake.address);
                const clientName:string = clientData != null ? clientData?.name : "";

                // Forming dto
                connectedClientsDto.push({
                    ip: clientSocket.handshake.address,
                    name: clientName
                });
                clientIO.emit(SocketRoom.STATUSES, connectedClientsDto);
                break;

            // If we connect frontend
            case 'frontend':
                if (password != frontEndPassword) {
                    clientSocket.disconnect();
                    return;
                }

                // Updating names
                for(let connectedClientDtoI = 0; connectedClientDtoI < connectedClientsDto.length; connectedClientDtoI++){
                    // Getting data from db
                    const clientData = await getClientByIp(connectedClientsDto[connectedClientDtoI].ip);
                    const clientName:string = clientData != null ? clientData?.name : "";

                    connectedClientsDto[connectedClientDtoI].name = clientName;
                }

                // Send data to client
                console.log('Front-end: ', clientSocket.handshake.address);
                clientSocket.emit(SocketRoom.INIT_FRONT, connectedClientsDto);
                break;
            // Default
            default:
                clientSocket.disconnect();
                return;
                break;
        }

        // Handle client disconnection
        clientSocket.on('disconnect', () => {
            // Searching client in connectedClient list
            const disconnectedID = Object.keys(connectedClients).find(
                (id) => connectedClients[id] === clientSocket
            );

            // If founded -> sending data about client disconnected
            if (disconnectedID) {
                // Clear from list
                delete connectedClients[disconnectedID];

                // Clear from DTO list
                connectedClientsDto.forEach((dto, i ) =>{
                    if(dto.ip == disconnectedID) connectedClientsDto.splice(i, 1);
                });
                clientIO.emit(SocketRoom.STATUSES, connectedClientsDto);
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
            client = client.replace(' ', '');

            // Send command to client
            sendDataOnSocketToClient(client, SocketRoom.SEND_COMMAND, command);
        });
    }
    catch (e) {
        console.log(e);
    }
}

// Send buttron click with some repeats
export async function sendButtonClick(params: SendButtonClickDTO){
    // Forming string command to send it to client
    const command = getCommand(ButtonActionTypes.press, keys[params.action]?.label, params.repeatsCount);

    try {
        // Trying to send press button command
        params.emitClients.forEach(client => {
            console.log(`${command} -> ${client}`);
            client = client.replace(' ', '');

            // Send command to client
            sendDataOnSocketToClient(client, SocketRoom.SEND_COMMAND, command);
        })
    }
    catch(e){
        console.log(e);
    }
}

async function sendDataOnSocketToClient(client:string, room:SocketRoom, command:string) {
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
}