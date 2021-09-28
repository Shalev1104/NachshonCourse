import jwt from 'jsonwebtoken';
import express from 'express';
import { User } from '../model/User'
import { ErrorHandler } from '../middleware/errorHandler';
require('dotenv').config();


const authorize = (req : express.Request, res : express.Response, next : express.NextFunction) => {
    try
    {
        const token : string = req.headers.authorization ? req.headers.authorization.split(' ')[1] : req.cookies.jwt;
        jwt.verify(token, process.env.USER_SECRET as jwt.Secret, (err : jwt.VerifyErrors | null, decodedToken : jwt.JwtPayload|undefined) => {
            if(err)
                return next(new ErrorHandler(403, err.message));
            return next();
        });
    }
    catch(err)
    {
        return next(new ErrorHandler(401));
    }
}
const setUserToView = (req : express.Request, res : express.Response, next : express.NextFunction) => {
    try
    {
        const token : string = req.headers.authorization ? req.headers.authorization.split(' ')[1] : req.cookies.jwt;
        jwt.verify(token, process.env.USER_SECRET as jwt.Secret, async (err : jwt.VerifyErrors | null, decodedToken : jwt.JwtPayload|undefined) => {
            if(err)
                return next();
            res.locals.user = (await User.isExists((decodedToken as jwt.JwtPayload).user))?.userName;
            return next();
        });
    }
    catch
    {
        return next();
    }
}

module.exports = { authorize, setUserToView }
