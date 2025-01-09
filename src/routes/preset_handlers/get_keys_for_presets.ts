import express, { Request, Response } from 'express';
import verifyToken from '../../middlewares/verify_token';
import { keys } from '../../configs/config_loader'
import {GetPresets} from '../../models/preset';

const addPresetRoute = express.Router();

addPresetRoute.get('/get_keys', [
    verifyToken
],
    async (req: Request, res: Response) => {

        // Getting presets
        try{
            res.status(200).json({ status: 'ok', data: keys});
        }
        // Catching errors
        catch(e){
            console.log(e);
            res.status(500).json({ errors: ["Unexpected error"] });
        }

    });

export default addPresetRoute;