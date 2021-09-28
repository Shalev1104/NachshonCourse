import express from 'express';
import { ErrorHandler, errHandler } from './middleware/errorHandler';
import cookieParser from 'cookie-parser';
require('dotenv').config();

const app = express();

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
app.use('/user',require('./routes/auth'));
app.use('/posts',require('./routes/posts'));
//Redirects
app.get("/", (req : express.Request, res : express.Response) => {
    res.redirect('/posts');
});

app.use((req : express.Request ,res : express.Response, next : express.NextFunction) => {
    next(new ErrorHandler(404));
});
app.use(errHandler);
app.listen(3000);
