import express, { Request, Response } from 'express';
import verifyToken from '../../middlewares/verify_token';
import { CreateProcessPreset } from '../../models/process_preset'
import { validateProcessPresetMiddleware } from '../../middlewares/process_preset_validation';

const addProcessPresetRoute = express.Router();

addProcessPresetRoute.post('/add_process_preset', [
    verifyToken,
    validateProcessPresetMiddleware
],
    async (req: Request, res: Response) => {
        const preset = req.body;

        // Trying to create preset
        try{
            await CreateProcessPreset(preset);
            res.status(200).json({ status: 'ok'});
        }
        // Catching errors
        catch(e){
            console.log(e);
            res.status(500).json({ errors: ["Unexpected error"] });
        }

    });

export default addProcessPresetRoute;