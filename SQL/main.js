"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var errorHandler_1 = require("./api/errorHandler");
var cookie_parser_1 = __importDefault(require("cookie-parser"));
require('dotenv').config();
var app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static('public')); // client static files
// view engine setup
app.use(express_1.default.static('views')); // client dynamic files with ejs
app.set('view engine', 'ejs');
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/favicon.ico', express_1.default.static('redditIcon.ico'));
app.use(require('./routes/auth'));
app.get("/", function (req, res) {
    res.render('home', { title: 'Home', posts: [{ title: "Check", description: "smdksmdmadsadjdnasjndjnsajdnjaddsjabdjsabdbuasdyasudbhusabdubasdusaudbsabyububdyusvycvsuybcyusabycusabcyusadguasdabcbysaubcasbcyusabicnasgduysabcisabuycubsayusasadsadasdkasjkdjkashjdhjkashdjkhaskjdhjkasdhasjkhdjksahjkdhajksdklsakldhskalhdklsahkjdkashjkdhaskhdjkashjkdahjhdsajkskmdasndasdhsabdhbsahdbhsabdhsabdhbsahbdhasbdhbashdbashbdhsadhsbdsahbdhbahsbdhabshdbasbdhahdsabhbdashssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssrewrewrewrewrewrwrmewiojriwerheiwrjiewriojeworguiwehioewjruigewuriewhruihewiuruiewgruiewurhweiohroiewiorewiojriowjeriojewoirhuiwgrwebrwieruewhorhuerhewohruwbsjkbcjkbdsfkjnjkfajkd", type: "No Type" }, { title: "Check this out!", description: "So funny", type: "Entertainment" }, { title: "Who am i?", description: "", type: "Discussion" }, { title: "Check", description: "smdksmdmaskmdasndasdhsabdhbsahdbhsabdhsabdhbsahbdhasbdhbashdbashbdhsadhsbdsahbdhbahsbdhabshdbasbdhahdsabhbdashssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssrewrewrewrewrewrwrmewiojriwerheiwrjiewriojeworguiwehioewjruigewuriewhruihewiuruiewgruiewurhweiohroiewiorewiojriowjeriojewoirhuiwgrwebrwieruewhorhuerhewohruwbsjkbcjkbdsfkjnjkfajkdisagduiashiodhasuidgiusahduiahsiugdiuagdisssssssssssssssssssssssss", type: "No Type" }] });
});
app.get("/register", function (req, res) {
    res.render('register', { title: 'Register', action: '/register' });
});
app.get("/login", function (req, res) {
    res.render('login', { title: 'Login', action: '/login' });
});
app.use(function (req, res, next) {
    next(new errorHandler_1.ErrorHandler(404));
});
app.use(function (error, req, res, next) {
    res.status(error.status);
    if (error.message)
        return res.json({ error: error.message });
    return res.json({ status: error.messageStatus });
});
app.listen(3000);
