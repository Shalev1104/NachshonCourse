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
var router = express_1.default.Router();
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
router.use('/user', require('./routes/auth'));
router.use('/posts', require('./routes/posts'));
//Redirects
router.get("/", function (req, res) {
    res.redirect('/posts');
});
router.use(function (req, res, next) {
    try {
        for (var _i = 0, _a = router.stack; _i < _a.length; _i++) {
            var i = _a[_i];
            if (i.handle.stack) {
                for (var _b = 0, _c = i.handle.stack; _b < _c.length; _b++) {
                    var j = _c[_b];
                    try {
                        if (j.route.path == req.path) {
                            return next(new errorHandler_1.ErrorHandler(405));
                        }
                    }
                    catch (_d) {
                    }
                }
            }
        }
    }
    catch (_e) {
    }
    return next();
});
router.use(function (req, res, next) {
    next(new errorHandler_1.ErrorHandler(404));
});
router.use(errorHandler_1.errHandler);
app.use(router);
app.listen(port);
