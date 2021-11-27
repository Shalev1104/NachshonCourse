import express from 'express';
import { auth } from 'firebase-admin';

export default function verifyFirebaseToken (req : express.Request, res : express.Response, next : express.NextFunction) {
    
    try
    {
        const token = req.headers['authorization']?.split(' ')[1];
        if(!token)
            throw new Error();
        auth().verifyIdToken(token)
            .then(() => next())
            .catch((err) => res.status(403).json((err as Error).message));
    }
    catch
    {
        res.status(401).json({error : "Not authenticated"})
    }
    
} 