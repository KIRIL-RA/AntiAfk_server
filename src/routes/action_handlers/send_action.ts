import express, { Request, Response } from 'express';
import { validateActionMiddleware } from '../../middlewares/action_validation_preset';
import verifyToken from '../../middlewares/verify_token';
import {sendAction} from '../../models/socket';

const addPresetRoute = express.Router();

addPresetRoute.post('/send_action', [
    verifyToken,
    validateActionMiddleware
],
    async (req: Request, res: Response) => {
        const action = req.body;

        // Trying to create preset
        try{
            await sendAction(action);
            res.status(200).json({ status: 'ok'});
        }
        // Catching errors
        catch(e){
            console.log(e);
            res.status(500).json({ errors: ["Unexpected error"] });
        }

    });

export default addPresetRoute;