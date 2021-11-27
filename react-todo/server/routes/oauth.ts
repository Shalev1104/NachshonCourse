import express from 'express';
import request from 'superagent'
const router = express.Router();

router.get('/authenticate/:code', async (req : express.Request, res : express.Response) => {
    const { code } = req.params;
    
    if(!code)
        return res.status(400).json({ message : 'Not received params'});

    const response = await request.post(`https://github.com/login/oauth/access_token`)
    .send({
        client_id : process.env.GITHUB_APP_ID,
        client_secret : process.env.GITHUB_CLIENT_SECRET,
        code
    })
    .set('Accept', 'application/json');
    if(!response.ok)
        return res.status(403).json(response.error);
    return res.status(200).json(response.body);
})

module.exports = router;