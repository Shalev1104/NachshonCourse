import jwt from 'jsonwebtoken';
import express from 'express';
import { User } from '../model/User'
require('dotenv').config();

interface TokenStructure extends User{
    iat : number,
    expiresIn : string
}
module.exports = async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    try
    {
        const token = req.headers.authorization?.split(' ')[1];
        const user = <TokenStructure> jwt.verify(token!, process.env.USER_SECRET as jwt.Secret);
        // if (req.body.userId !== await user.getId()) {
        //     throw 'Invalid user ID';
        // }
        // else {
        //     next(user);
        // }
    }
    catch(err)
    {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
}