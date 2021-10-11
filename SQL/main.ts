import express from 'express';
import { ErrorHandler, errHandler } from './middleware/errorHandler';
import cookieParser from 'cookie-parser';
require('dotenv').config();

const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;

//Middlewares
const { setUserToView } = require('./middleware/authorize');

app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));

// view engine setup
app.use(express.static('views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended:true }));
app.use('/favicon.ico', express.static('redditIcon.ico'));
app.get('*', setUserToView);

//Routes
router.use('/user',require('./routes/auth'));
router.use('/posts',require('./routes/posts'));

//Redirects
router.get("/", (req : express.Request, res : express.Response) => {
    res.redirect('/posts');
});

router.use((req, res, next) => {
    try
    {
        for(let i of router.stack)
        {
            if(i.handle.stack)
            {
                for(let j of i.handle.stack)
                {
                    try
                    {
                        if(j.route.path == req.path)
                        {
                            return next(new ErrorHandler(405));
                        }   
                    }
                    catch
                    {

                    }
                }
            }
        }
    }
    catch
    {
    }
    return next();
});

router.use((req : express.Request ,res : express.Response, next : express.NextFunction) => {
    next(new ErrorHandler(404));
});
router.use(errHandler);
app.use(router);
app.listen(port);
