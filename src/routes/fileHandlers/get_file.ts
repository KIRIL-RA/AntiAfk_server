import express, { Request, Response } from 'express';
import verifyToken from '../../middlewares/verify_client_token';
import path from 'path';
import fs from 'fs';
import { config } from '../../configs/config_loader';

const getFile = express.Router();

getFile.get('/get_file/:fileName', [
    verifyToken
],
    async (req: Request, res: Response) => {
        // Getting parameters
        const fileName = req.params.fileName;
        const filePath = path.join(config.filesPath, fileName);

        // Check that, this file is exist
        if (!fs.existsSync(filePath)) {
            res.status(404).json({ message: 'File not found' });
            return;
        }

        // Sending file if all ok
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: 'Error serving the file' });
            }
        });

    });

export default getFile;