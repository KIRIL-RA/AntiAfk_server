import express, { Request, Response } from 'express';
import verifyToken from '../middlewares/verify_token';
import { getClientByIp } from '../models/client'

const addPresetRoute = express.Router();

addPresetRoute.get('/get_client/:clientIp', [
    verifyToken
],
    async (req: Request, res: Response) => {
        const clientIp = req.params.clientIp;

        // Getting presets
        try{
            const preset = await getClientByIp(clientIp);
            res.status(200).json({ status: 'ok', data: preset});
        }
        // Catching errors
        catch(e){
            console.log(e);
            res.status(500).json({ errors: ["Unexpected error"] });
        }

    });

export default addPresetRoute;