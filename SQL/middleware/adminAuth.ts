import express, { Router } from 'express';
import { User } from '../model/User';
import { Admin } from '../model/Admin';
module.exports = (user : User|Admin, req : express.Request, res : express.Response, next : express.NextFunction) => {
    user instanceof Admin ? next() : console.log('error');
}