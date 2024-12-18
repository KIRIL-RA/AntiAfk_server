import express, { Request, Response } from 'express';
import { validateCLientMiddleware } from '../middlewares/client_name_validation';
import verifyToken from '../middlewares/verify_token';
import { createClient } from '../models/client';
import { Prisma } from '@prisma/client';

const addPresetRoute = express.Router();

addPresetRoute.post('/create_client', [
    verifyToken,
    validateCLientMiddleware
],
    async (req: Request, res: Response) => {
        const client = req.body;
        
        // Trying to create preset
        try{
            await createClient(client);
            res.status(200).json({ status: 'ok'});
        }
        // Catching errors
        catch(e){
            console.log(e);
            if(e instanceof Prisma.PrismaClientKnownRequestError){
                res.status(400).json({ errors: ["Ip already exist"] });
                return;
            }
            res.status(500).json({ errors: ["Unexpected error"] });
        }

    });

export default addPresetRoute;