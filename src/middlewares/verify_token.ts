import express, { Request, Response, NextFunction } from 'express';

function verifyToken (req: Request, res: Response, next: NextFunction) {
    const token = req.body?.token || req?.query?.token;

    if(token){
        if(token == process.env.GET_TOKEN) next();
        else res.status(401).json({errors: ["incorrect token"]});
    }
    else res.status(400).json({errors: ["'token' must be provided"]});
}

export default verifyToken;