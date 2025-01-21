import { NextFunction } from 'express';
import { Request, Response } from 'express';
import multer from 'multer';
import { config } from '../configs/config_loader';
import ensureDirectoryIsExists from '../models/files';

// File size limit in bytes 
const FILE_SIZE_LIMIT = config.maxFileSizeInMb * 1024 * 1024;

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.filesPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

// File filter to restrict file extensions
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Only allow .ahk files
    if (file.originalname.endsWith(config.acceptableFileFormat)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Invalid file type. Only .ahk files are allowed!')); // Reject the file
    }
};

const upload = multer({
    storage,
    limits: { fileSize: FILE_SIZE_LIMIT },
    fileFilter
});

function uploadFile(req: Request, res: Response, next: NextFunction) {
    ensureDirectoryIsExists();

    // Uploadinf file
    const uploadFile_ = upload.single('file');
    uploadFile_(req, res, (err) => {
        console.log(err);
        // Validating, that file exists in request
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        next();
    });
}

export default uploadFile;