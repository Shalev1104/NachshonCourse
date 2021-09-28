import express from 'express';
import { User } from '../model/User';
import { Admin } from '../model/Admin';
import { ErrorHandler } from '../middleware/errorHandler';
module.exports = (user : User, req : express.Request, res : express.Response, next : express.NextFunction) => {
    user instanceof Admin ? next() : next(new ErrorHandler(403));
}