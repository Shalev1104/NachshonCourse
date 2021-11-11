import { AuthError, EmailAuthCredential, EmailAuthProvider, FacebookAuthProvider, GithubAuthProvider, GoogleAuthProvider, OAuthCredential } from 'firebase/auth';
import express from 'express';
import { login, logout, register } from '../controller/firebaseAuth';

const router = express.Router();

router.post(['/login/email','/login/google','/login/github','/login/facebook'], async (req : express.Request, res : express.Response) => {
    const { token, email, password } = req.body;

    if(!token && !(email || password))
        return res.status(400).json({ message : 'missing fields'});
    
    function getCredential () : OAuthCredential | EmailAuthCredential  {
        switch(req.path)
        {
            case '/login/google' :
                return GoogleAuthProvider.credential(token);
            case '/login/facebook' :
                return FacebookAuthProvider.credential(token);
            case '/login/github' : 
                return GithubAuthProvider.credential(token); 
            default : 
                return EmailAuthProvider.credential(email, password);
        }   
    }
    try { return res.status(200).json({ token : await (await login(getCredential()))?.user.getIdToken() }); }
    catch(err) { return res.status(500).json((err as AuthError).code); }
});

router.post('/register', async (req : express.Request, res : express.Response) => {
    const { email, password } = req.body;
    if(!email || !password)
        return res.status(400).json({ message : 'missing fields'});

    try {        return res.status(200).json({ token : await (await register(email, password)).user?.getIdToken() }); }
    catch(err) { return res.status(500).json((err as AuthError).code); }
});

router.get('/logout', async(req: express.Request, res : express.Response) => {
    logout().then(() => res.status(200).json({ logout : true }))
            .catch(() => res.status(500).json({ logout : false}));
});

module.exports = router;