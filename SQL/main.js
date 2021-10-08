"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var errorHandler_1 = require("./middleware/errorHandler");
var cookie_parser_1 = __importDefault(require("cookie-parser"));
require('dotenv').config();
var app = (0, express_1.default)();
var port = process.env.PORT || 3000;
//Middlewares
var setUserToView = require('./middleware/authorize').setUserToView;
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static('public'));
// view engine setup
app.use(express_1.default.static('views'));
app.set('view engine', 'ejs');
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/favicon.ico', express_1.default.static('redditIcon.ico'));
app.get('*', setUserToView);
//Routes
app.use('/user', require('./routes/auth'));
app.use('/posts', require('./routes/posts'));
//Redirects
app.get("/", function (req, res) {
    res.redirect('/posts');
});
app.use(function (req, res, next) {
    next(new errorHandler_1.ErrorHandler(404));
});
app.use(errorHandler_1.errHandler);
app.listen(port);
