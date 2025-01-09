import express, { Request, Response } from 'express';
import verifyToken from '../../middlewares/verify_token';
import { deletePreset } from '../../models/preset';

const deletePresetRoute = express.Router();

deletePresetRoute.delete('/delete_preset/:presetId', [
    verifyToken
],
    async (req: Request, res: Response) => {
        const presetId = req.params.presetId;

        // Trying to delete preset
        try {
            await deletePreset(presetId);
            res.status(200).json({ status: 'ok' });
        }
        // Catching errors
        catch (e) {
            console.log(e);
            res.status(500).json({ errors: ["Unexpected error"] });
        }
    });

export default deletePresetRoute;