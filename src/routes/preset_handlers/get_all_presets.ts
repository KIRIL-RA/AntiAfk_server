import express, { Request, Response } from 'express';
import verifyToken from '../../middlewares/verify_token';
import {GetPresets} from '../../models/preset';

const addPresetRoute = express.Router();

addPresetRoute.get('/get_all_presets', [
    verifyToken
],
    async (req: Request, res: Response) => {

        // Getting presets
        try{
            const presets = await GetPresets();
            res.status(200).json({ status: 'ok', data: presets});
        }
        // Catching errors
        catch(e){
            console.log(e);
            res.status(500).json({ errors: ["Unexpected error"] });
        }

    });

export default addPresetRoute;