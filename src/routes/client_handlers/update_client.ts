import express, { Request, Response } from 'express';
import { validateCLientMiddleware } from '../../middlewares/client_name_validation';
import verifyToken from '../../middlewares/verify_token';
import { updateClient } from '../../models/client';
import { Prisma } from '@prisma/client';

const addPresetRoute = express.Router();

addPresetRoute.post('/update_client', [
    verifyToken,
    validateCLientMiddleware
],
    async (req: Request, res: Response) => {
        const client = req.body;
        
        // Trying to create preset
        try{
            await updateClient(client?.ip, client?.name);
            res.status(200).json({ status: 'ok'});
        }

        // Catching errors
        catch(e){
            console.log(e);
            if(e instanceof Prisma.PrismaClientKnownRequestError){
                res.status(400).json({ errors: ["Ip not exist"] });
                return;
            }
            res.status(500).json({ errors: ["Unexpected error"] });
        }

    });

export default addPresetRoute;