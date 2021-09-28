import express from 'express';
import { User } from '../model/User';
import { Admin } from '../model/Admin';
import jwt from 'jsonwebtoken';
import { ErrorHandler } from '../middleware/errorHandler';

function generateToken(user : User) : string
{
    const secretType = user instanceof Admin ? process.env.ADMIN_SECRET : process.env.USER_SECRET;
    return jwt.sign({ user : user.userName }, secretType as jwt.Secret, { expiresIn : process.env.JWT_EXPIRE});
}

const router = express.Router();

router.get("/register", (req : express.Request, res : express.Response) => {
    res.render('register', { title: 'Register', action: '/user/register' });
});

router.get("/login", (req : express.Request, res : express.Response) => {
    res.render('login', { title : 'Login', action: '/user/login' });
});

router.post('/register',async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    try
    {
        const { username, password, role } = req.body;
        if(await User.isExists(username))
            return next(new ErrorHandler(409, "username already exists"));

        const user = (role == 'ADMIN' ? new Admin(username, password) : new User(username, password));
        if(!await User.authenticate(user))
        {
            throw new Error('Unable to insert fields');
        }
        const token = generateToken(user);
        res.cookie('jwt', token, { httpOnly : true });
        return res.status(201).json({ user : await user.getId() });
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
        return res.status(200).json({ user : user.id });
    }
    catch(err)
    {
        return next(new ErrorHandler(400, (err as Error).message));
    }
});
router.get('/logout', (req : express.Request, res : express.Response) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
});
module.exports = router;