const path = require('path');
const fs = require('fs');
import { ConfigI } from '../interfaces/config';
const isDev = true;

const _config = isDev ? JSON.parse(fs.readFileSync(path.join(path.dirname(__dirname), './configs/config.json'))) : JSON.parse(fs.readFileSync(path.join(path.dirname(process.execPath), './configs/config.json')));
const keys = isDev ? JSON.parse(fs.readFileSync(path.join(path.dirname(__dirname), './configs/keys.json'))) : JSON.parse(fs.readFileSync(path.join(path.dirname(process.execPath), './configs/keys.json')));
const dbUrl = isDev ? 'file:./database.db' : `file:${path.join(path.dirname(process.execPath), 'database.db')}`
const publicPath = isDev ? path.join(__dirname, '../../src/public') : path.join(path.dirname(process.execPath), 'public');
const filesPath = isDev ? path.join(__dirname, '../../server_uploads') : path.join(path.dirname(process.execPath), 'server_uploads');

const config: ConfigI = {
    dbUrl: dbUrl,
    client_pass: _config.client_pass || 'pass',
    frontend_pass: _config.frontend_pass || 'pass',
    port: _config.port || 3000,
    publicPath: publicPath,
    filesPath: filesPath,
    acceptableFileFormat: _config.acceptable_formats || 'ahk',
    maxFileSizeInMb: _config.max_file_size_in_mb || 5
}

export {config, keys};