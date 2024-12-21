import express, { Request, Response } from 'express';
import { validateSendButton } from '../../middlewares/send_button_validation_middleware';
import verifyToken from '../../middlewares/verify_token';
import {sendButtonClick} from '../../models/socket';

const addPresetRoute = express.Router();

addPresetRoute.post('/send_button', [
    verifyToken,
    validateSendButton
],
    async (req: Request, res: Response) => {
        const action = req.body;

        // Trying to create preset
        try{
            await sendButtonClick(action);
            res.status(200).json({ status: 'ok'});
        }
        // Catching errors
        catch(e){
            console.log(e);
            res.status(500).json({ errors: ["Unexpected error"] });
        }

    });

export default addPresetRoute;