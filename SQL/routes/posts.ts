import express from 'express';
import { User } from '../model/User';
import { Admin } from '../model/Admin';
import { ErrorHandler } from '../middleware/errorHandler';
import { Post } from '../model/Post';
import { Vote } from '../model/Vote';
import { readFileSync } from 'fs';
import { IRecordSet } from 'mssql';
import { Comment } from '../model/Comment';

const ejs = require('ejs');
const path = require('path');

const router = express.Router({ mergeParams : true });

//Middlewares
const { authorize } = require('../middleware/authorize');
const authAdmin = require('../middleware/adminAuth');

router.get("/", async(req : express.Request, res : express.Response) => {
    let title : string, posts : IRecordSet<any>;
    Post.reset();
    if(req.params.user)
    {
        title = 'My Posts'
        posts = await Post.getPostsSetUser(req.params.user);
    }
    else
    {
        title = 'Home';
        posts = await Post.getPosts();
    }
    res.render('home', { title, posts, votes : await userVotes(res.locals.user) });
});

router.get("/submit", authorize, (req : express.Request, res : express.Response, next : express.NextFunction) => {
    res.render('newPost', { title : 'NEW', action : '/posts/'});
});
router.post("/", authorize, async (req : express.Request, res : express.Response, next : express.NextFunction) => {
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

router.get('/:id', async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    const postId = req.params.id;
    const post = await Post.getPost(parseInt(postId));
    res.render('post', { title : post[0].title, action : `/posts/${postId}/comments`, posts : post, votes : await userVotes(res.locals.user), comments : await Comment.getPostComments(parseInt(postId)) })
});

router.post('/:id/comments', async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    try
    {
        const { username, comment } = req.body;
        const newComment = new Comment(parseInt(req.params.id), await parseUser(username), comment);
        if(!await newComment.insert())
        {
            throw new Error("Unable to create comment");
        }
        return res.status(201).json({ html : createTemplate('comment', { comments : [{...newComment, userName : username}] })});
    }
    catch(err)
    {
        return next(new ErrorHandler(400, (err as Error).message));
    }
});

router.post('/:id/votes', async (req : express.Request, res : express.Response, next : express.NextFunction) => {
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
router.put('/:id/votes', async (req : express.Request, res : express.Response, next : express.NextFunction) => {
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
router.delete('/:id/votes', async (req : express.Request, res : express.Response, next : express.NextFunction) => {
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

router.get("/search/:keyword", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    try
    {
        const key = req.params.keyword == "''" ? '' : req.params.keyword;
        const posts = await Post.getPostsSetSearch(key);
        const votes = await userVotes(res.locals.user);
        res.json({ html: createTemplate('posts' ,{ posts, votes }) });
    }
    catch(err)
    {
        console.log(err)
        return next(new ErrorHandler());
    }
});

router.get("/type/:selected", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    try
    {
        const posts = await Post.getPostsSetType(req.params.selected);
        const votes = await userVotes(res.locals.user);
        res.json({ html: createTemplate('posts', { posts, votes }) });
    }
    catch(err)
    {
        console.log(err);
        return next(new ErrorHandler());
    }
});

router.get("/order/:selected", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    try
    {
        const posts = await Post.getPostsSetOrder(req.params.selected);
        const votes = await userVotes(res.locals.user);
        res.json({ html: createTemplate('posts', { posts, votes }) });
    }
    catch(err)
    {
        console.log(err);
        return next(new ErrorHandler());
    }
});

async function parseUser(userName : string) : Promise<number>
{
    return (await User.isExists(userName)).id;
}
function createTemplate(view : string, options? : Object) : string
{
    const templatePath = path.resolve(__dirname, `../views/${view}.ejs`);
    const posts_template = ejs.compile(ejs.fileLoader(templatePath, 'utf8'), { filename: templatePath });
    return posts_template(options);
}
async function userVotes(user : string|undefined) : Promise<IRecordSet<any>|undefined>
{
    if(user)
        return await Vote.getAllUserVotes(user);
    return undefined;
}
module.exports = router;