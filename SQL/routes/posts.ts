import express from 'express';
import { User } from '../model/User';
import { Admin } from '../model/Admin';
import { ErrorHandler } from '../middleware/errorHandler';
import { Post } from '../model/Post';
import { Vote } from '../model/Vote';
import { readFileSync } from 'fs';

const ejs = require('ejs');
const path = require('path');

const router = express.Router();

//Middlewares
const { authorize } = require('../middleware/authorize');
const authAdmin = require('../middleware/adminAuth');


router.get("/", async(req : express.Request, res : express.Response) => {
    const user = res.locals.user;
    const votes = user ? await Vote.getUserVotes(user) : undefined;
    res.render('home', { title : 'Home', posts: await Post.getAllPosts(), votes });
});
router.get("/new", authorize, (req : express.Request, res : express.Response, next : express.NextFunction) => {
    res.render('newPost', { title : 'NEW', action : '/posts/new'});
});
router.post("/new", authorize, async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    try
    {
        const { title, type, description, username } = req.body;
        const userId = await parseUser(username);
        const post = new Post(userId, type, title, description);
        if(!await Post.create(post))
            throw new Error("Unable to create post");
        return res.status(201).json({ post : true });
    }
    catch(err)
    {
        return next(new ErrorHandler(400, (err as Error).message));
    }

});
router.post('/:id', async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    try
    {
        const postId = parseInt(req.params.id);
        const { user, isLike } = req.body;
        const userId = await parseUser(user);
        const vote = new Vote(postId, userId, isLike);
        if(!await vote.insert())
            throw new Error();
        return res.status(201).json({ vote : await vote.getId() });
    }
    catch
    {
        return next(new ErrorHandler());
    }
});
router.put('/:id', async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    try
    {
        const postId = parseInt(req.params.id);
        const { user, isLike } = req.body;
        const userId = await parseUser(user);
        const vote = new Vote(postId, userId);
        if(!await vote.update(isLike))
            throw new Error();
        return res.status(200).json({ vote : await vote.getId() });
    }
    catch
    {
        return next(new ErrorHandler());
    }
});
router.delete('/:id', async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    try
    {
        const postId = parseInt(req.params.id);
        const { user } = req.body;
        const userId = await parseUser(user);
        const vote = new Vote(postId, userId);
        const id = await vote.getId();
        if(!await vote.delete())
            throw new Error();
        return res.status(200).json({ vote : id });
    }
    catch
    {
        return next(new ErrorHandler());
    }
});
router.get("/:user", (req : express.Request, res : express.Response, next : express.NextFunction) => {

});

router.get("/search/:keyword", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    try
    {
        const key = req.params.keyword == "''" ? '' : req.params.keyword;
        const posts = await Post.getPostsBySearch(key);
        const posts_template = ejs.compile(readFileSync(path.join(__dirname, '/../views/posts.ejs'), 'utf8'));
        const html = posts_template({posts: posts});
        const user = res.locals.user;
        const votes = user ? await Vote.getUserVotes(user) : undefined;
        res.json({ html: html, votes });
    }
    catch
    {
        return next(new ErrorHandler());
    }
});

async function parseUser(userName : string) : Promise<number>
{
    return (await User.isExists(userName)).id;
}

module.exports = router;