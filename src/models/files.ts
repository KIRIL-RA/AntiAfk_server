import fs from 'fs';
import path from 'path';
import { config } from '../configs/config_loader';

// Ensure the "files" directory exists

export default function ensureDirectoryExist(): void {
    if (!fs.existsSync(config.filesPath)) {
        console.log('no');
        fs.mkdirSync(config.filesPath, { recursive: true });
    }
}
