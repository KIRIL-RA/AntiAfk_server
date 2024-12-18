const path = require('path');
const fs = require('fs');
const isDev = true;

const config = isDev ? JSON.parse(fs.readFileSync(path.join(path.dirname(__dirname), './configs/config.json'))) : JSON.parse(fs.readFileSync(path.join(path.dirname(process.execPath), './configs/config.json')));
const keys = isDev ? JSON.parse(fs.readFileSync(path.join(path.dirname(__dirname), './configs/keys.json'))) : JSON.parse(fs.readFileSync(path.join(path.dirname(process.execPath), './configs/keys.json')));

export {config, keys};