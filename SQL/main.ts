import express from 'express';
import { ErrorHandler } from './api/errorHandler';
import cookieParser from 'cookie-parser'
require('dotenv').config();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.static('public')); // client static files
// view engine setup
app.use(express.static('views')); // client dynamic files with ejs
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended:true }));
app.use('/favicon.ico', express.static('redditIcon.ico'));
app.use(require('./routes/auth'));
app.get("/", (req : express.Request, res : express.Response) => {
    res.render('home', { title : 'Home', posts: [{title:"Check", description:"smdksmdmadsadjdnasjndjnsajdnjaddsjabdjsabdbuasdyasudbhusabdubasdusaudbsabyububdyusvycvsuybcyusabycusabcyusadguasdabcbysaubcasbcyusabicnasgduysabcisabuycubsayusasadsadasdkasjkdjkashjdhjkashdjkhaskjdhjkasdhasjkhdjksahjkdhajksdklsakldhskalhdklsahkjdkashjkdhaskhdjkashjkdahjhdsajkskmdasndasdhsabdhbsahdbhsabdhsabdhbsahbdhasbdhbashdbashbdhsadhsbdsahbdhbahsbdhabshdbasbdhahdsabhbdashssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssrewrewrewrewrewrwrmewiojriwerheiwrjiewriojeworguiwehioewjruigewuriewhruihewiuruiewgruiewurhweiohroiewiorewiojriowjeriojewoirhuiwgrwebrwieruewhorhuerhewohruwbsjkbcjkbdsfkjnjkfajkd", type:"No Type"}, {title:"Check this out!", description:"So funny", type:"Entertainment"}, {title:"Who am i?", description:"", type:"Discussion"},{title:"Check", description:"smdksmdmaskmdasndasdhsabdhbsahdbhsabdhsabdhbsahbdhasbdhbashdbashbdhsadhsbdsahbdhbahsbdhabshdbasbdhahdsabhbdashssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssrewrewrewrewrewrwrmewiojriwerheiwrjiewriojeworguiwehioewjruigewuriewhruihewiuruiewgruiewurhweiohroiewiorewiojriowjeriojewoirhuiwgrwebrwieruewhorhuerhewohruwbsjkbcjkbdsfkjnjkfajkdisagduiashiodhasuidgiusahduiahsiugdiuagdisssssssssssssssssssssssss", type:"No Type"}]});
});
app.get("/register", (req : express.Request, res : express.Response) => {
    res.render('register', { title: 'Register', action: '/register' });
});

app.get("/login", (req : express.Request, res : express.Response) => {
    res.render('login', { title : 'Login', action: '/login' });
});


app.use((req : express.Request ,res : express.Response, next : express.NextFunction) => {
    next(new ErrorHandler(404));
});
app.use((error : ErrorHandler, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(error.status as number);
    if(error.message)
        return res.json({ error : error.message });
    return res.json({ status : error.messageStatus });
});
app.listen(3000);