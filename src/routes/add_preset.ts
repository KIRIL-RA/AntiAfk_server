import express, { Request, Response } from 'express';
import { validatePresetMiddleware } from '../middlewares/prest_validation';
import verifyToken from '../middlewares/verify_token';
import {CreatePreset} from '../models/preset';

const addPresetRoute = express.Router();

addPresetRoute.post('/add_preset', [
    verifyToken,
    validatePresetMiddleware
],
    async (req: Request, res: Response) => {
        const preset = req.body;

        // Trying to create preset
        try{
            await CreatePreset(preset);
            res.status(200).json({ status: 'ok'});
        }
        // Catching errors
        catch(e){
            console.log(e);
            res.status(500).json({ errors: ["Unexpected error"] });
        }

    });

export default addPresetRoute;