import express from 'express';
import { User } from '../model/User';
import { Admin } from '../model/Admin';
import jwt from 'jsonwebtoken';
import { ErrorHandler } from '../api/errorHandler';

function generateToken(user : User) : string
{
    if(user instanceof Admin)
        return jwt.sign(user.userName, process.env.ADMIN_SECRET as jwt.Secret);
    return jwt.sign(user.userName, process.env.USER_SECRET as jwt.Secret);
}

const router = express.Router();

router.post('/register',async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    try
    {
        const { username, password, role } = req.body;

        if(await User.isExists(username))
            return next(new ErrorHandler(409, "username already exists"));

        const user = (role === 'ADMIN' ? new Admin(username, password) : new User(username, password));
        
        user.authenticate()
        .then(async () => {
            const token = generateToken(user);
            res.cookie('jwt', token, { httpOnly : true });
            return res.status(201).json({ user : await user.getId() });
        })
        .catch(() => {
            return next(new ErrorHandler(400, 'failed validate field corectly'));
        });
    }
    catch(err)
    {
        return next(new ErrorHandler(400, (err as Error).message));
    }
});
router.post('/login', async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    try {
        const { username, password } = req.body;
        const user = await User.login(username, password);

        if(typeof user == 'undefined')
            return next(new ErrorHandler(401, "username or password incorrect"));
        
        const token = generateToken(user);
        res.cookie('jwt', token, { httpOnly : true });
        return res.status(200).json({ login : true });
    }
    catch(err)
    {
        return next(new ErrorHandler(400, (err as Error).message));
    }
});
module.exports = router;