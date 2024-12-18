import express, { Request, Response } from 'express';
import verifyToken from '../middlewares/verify_token';
import {getPresetById} from '../models/preset';

const addPresetRoute = express.Router();

addPresetRoute.get('/get_preset/:presetId', [
    verifyToken
],
    async (req: Request, res: Response) => {
        const presetId = req.params.presetId;

        // Getting presets
        try{
            const preset = await getPresetById(presetId);
            res.status(200).json({ status: 'ok', data: preset});
        }
        // Catching errors
        catch(e){
            console.log(e);
            res.status(500).json({ errors: ["Unexpected error"] });
        }

    });

export default addPresetRoute;