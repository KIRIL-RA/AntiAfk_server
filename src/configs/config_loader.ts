const path = require('path');
const fs = require('fs');
const isDev = true;

const _config = isDev ? JSON.parse(fs.readFileSync(path.join(path.dirname(__dirname), './configs/config.json'))) : JSON.parse(fs.readFileSync(path.join(path.dirname(process.execPath), './configs/config.json')));
const keys = isDev ? JSON.parse(fs.readFileSync(path.join(path.dirname(__dirname), './configs/keys.json'))) : JSON.parse(fs.readFileSync(path.join(path.dirname(process.execPath), './configs/keys.json')));

const config: ConfigI = {
    client_pass: _config.client_pass || 'pass',
    frontend_pass: _config.frontend_pass || 'pass',
    port: _config.port || 3000
}

export {config, keys};