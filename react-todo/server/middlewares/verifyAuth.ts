import express from 'express';
import { OAuth2Client } from 'google-auth-library';

export default function verifyFirebaseToken (req : express.Request, res : express.Response, next : express.NextFunction) {
    
    try
    {
        const token = req.headers['authorization']?.split(' ')[1];
        if(!token)
            throw new Error();

        const googleAppId = process.env.GOOGLE_APP_ID;
        new OAuth2Client(googleAppId).verifyIdToken({
            idToken: token,
            audience: googleAppId
        })
        .then(() => next())
        .catch(() => res.status(403).json({error : "Access denied"}));
    }
    catch
    {
        res.status(401).json({error : "Not authenticated"})
    }
    
} 