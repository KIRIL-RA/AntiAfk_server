import express, { Request, Response } from 'express';
import verifyToken from '../../middlewares/verify_token';
import fileUploadMiddleware from '../../middlewares/save_file_middleware'
import { sendUploadFile } from '../../models/socket';

const uploadFile = express.Router();

uploadFile.post('/upload_file', [
    verifyToken,
    fileUploadMiddleware
],
    async (req: Request, res: Response) => {

        // Trying to save file
        try {
            if(req.file) await sendUploadFile(req.file.originalname);
            else throw new Error("Can't upload file");

            res.status(200).json({
                status: 'ok'
            });
        }
        // Catching errors
        catch (e) {
            console.log(e);
            res.status(500).json({ errors: ["Unexpected error"] });
        }
    });

export default uploadFile;