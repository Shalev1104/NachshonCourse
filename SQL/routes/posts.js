"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var User_1 = require("../model/User");
var errorHandler_1 = require("../middleware/errorHandler");
var Post_1 = require("../model/Post");
var Vote_1 = require("../model/Vote");
var Comment_1 = require("../model/Comment");
var ejs = require('ejs');
var path = require('path');
var router = express_1.default.Router({ mergeParams: true });
//Middlewares
var authorize = require('../middleware/authorize').authorize;
var authAdmin = require('../middleware/adminAuth');
router.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var title, posts, _a, _b, _c;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                Post_1.Post.reset();
                if (!req.params.user) return [3 /*break*/, 2];
                title = 'My Posts';
                return [4 /*yield*/, Post_1.Post.getPostsSetUser(req.params.user)];
            case 1:
                posts = _e.sent();
                return [3 /*break*/, 4];
            case 2:
                title = 'Home';
                return [4 /*yield*/, Post_1.Post.getPosts()];
            case 3:
                posts = _e.sent();
                _e.label = 4;
            case 4:
                _b = (_a = res).render;
                _c = ['home'];
                _d = { title: title, posts: posts };
                return [4 /*yield*/, userVotes(res.locals.user)];
            case 5:
                _b.apply(_a, _c.concat([(_d.votes = _e.sent(), _d)]));
                return [2 /*return*/];
        }
    });
}); });
router.get("/submit", authorize, function (req, res, next) {
    res.render('newPost', { title: 'NEW', action: '/posts/' });
});
router.post("/", authorize, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, type, description, username, userId, post, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, title = _a.title, type = _a.type, description = _a.description, username = _a.username;
                return [4 /*yield*/, parseUser(username)];
            case 1:
                userId = _b.sent();
                post = new Post_1.Post(userId, type, title, description);
                return [4 /*yield*/, Post_1.Post.create(post)];
            case 2:
                if (!(_b.sent()))
                    throw new Error("Unable to create post");
                return [2 /*return*/, res.status(201).json({ post: true })];
            case 3:
                err_1 = _b.sent();
                return [2 /*return*/, next(new errorHandler_1.ErrorHandler(400, err_1.message))];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/:id', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var postId, post, _a, _b, _c;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                postId = req.params.id;
                return [4 /*yield*/, Post_1.Post.getPost(parseInt(postId))];
            case 1:
                post = _e.sent();
                _b = (_a = res).render;
                _c = ['post'];
                _d = { title: post[0].title, action: "/posts/".concat(postId, "/comments"), posts: post };
                return [4 /*yield*/, userVotes(res.locals.user)];
            case 2:
                _d.votes = _e.sent();
                return [4 /*yield*/, Comment_1.Comment.getPostComments(parseInt(postId))];
            case 3:
                _b.apply(_a, _c.concat([(_d.comments = _e.sent(), _d)]));
                return [2 /*return*/];
        }
    });
}); });
router.post('/:id/comments', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, comment, newComment, _b, _c, err_2;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                _a = req.body, username = _a.username, comment = _a.comment;
                _b = Comment_1.Comment.bind;
                _c = [void 0, parseInt(req.params.id)];
                return [4 /*yield*/, parseUser(username)];
            case 1:
                newComment = new (_b.apply(Comment_1.Comment, _c.concat([_d.sent(), comment])))();
                return [4 /*yield*/, newComment.insert()];
            case 2:
                if (!(_d.sent())) {
                    throw new Error("Unable to create comment");
                }
                return [2 /*return*/, res.status(201).json({ html: createTemplate('comment', { comments: [__assign(__assign({}, newComment), { userName: username })] }) })];
            case 3:
                err_2 = _d.sent();
                return [2 /*return*/, next(new errorHandler_1.ErrorHandler(400, err_2.message))];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/:id/votes', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var postId, _a, user, isLike, userId, vote, _b, _c, _d;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 4, , 5]);
                postId = parseInt(req.params.id);
                _a = req.body, user = _a.user, isLike = _a.isLike;
                return [4 /*yield*/, parseUser(user)];
            case 1:
                userId = _f.sent();
                vote = new Vote_1.Vote(postId, userId, isLike);
                return [4 /*yield*/, vote.insert()];
            case 2:
                if (!(_f.sent()))
                    throw new Error();
                _c = (_b = res.status(201)).json;
                _e = {};
                return [4 /*yield*/, vote.getId()];
            case 3: return [2 /*return*/, _c.apply(_b, [(_e.vote = _f.sent(), _e)])];
            case 4:
                _d = _f.sent();
                return [2 /*return*/, next(new errorHandler_1.ErrorHandler())];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.put('/:id/votes', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var postId, _a, user, isLike, userId, vote, _b, _c, _d;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 4, , 5]);
                postId = parseInt(req.params.id);
                _a = req.body, user = _a.user, isLike = _a.isLike;
                return [4 /*yield*/, parseUser(user)];
            case 1:
                userId = _f.sent();
                vote = new Vote_1.Vote(postId, userId);
                return [4 /*yield*/, vote.update(isLike)];
            case 2:
                if (!(_f.sent()))
                    throw new Error();
                _c = (_b = res.status(200)).json;
                _e = {};
                return [4 /*yield*/, vote.getId()];
            case 3: return [2 /*return*/, _c.apply(_b, [(_e.vote = _f.sent(), _e)])];
            case 4:
                _d = _f.sent();
                return [2 /*return*/, next(new errorHandler_1.ErrorHandler())];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.delete('/:id/votes', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var postId, user, userId, vote, id, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                postId = parseInt(req.params.id);
                user = req.body.user;
                return [4 /*yield*/, parseUser(user)];
            case 1:
                userId = _b.sent();
                vote = new Vote_1.Vote(postId, userId);
                return [4 /*yield*/, vote.getId()];
            case 2:
                id = _b.sent();
                return [4 /*yield*/, vote.delete()];
            case 3:
                if (!(_b.sent()))
                    throw new Error();
                return [2 /*return*/, res.status(200).json({ vote: id })];
            case 4:
                _a = _b.sent();
                return [2 /*return*/, next(new errorHandler_1.ErrorHandler())];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.get("/search/:keyword", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var key, posts, votes, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                key = req.params.keyword == "''" ? '' : req.params.keyword;
                return [4 /*yield*/, Post_1.Post.getPostsSetSearch(key)];
            case 1:
                posts = _a.sent();
                return [4 /*yield*/, userVotes(res.locals.user)];
            case 2:
                votes = _a.sent();
                res.json({ html: createTemplate('posts', { posts: posts, votes: votes }) });
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                console.log(err_3);
                return [2 /*return*/, next(new errorHandler_1.ErrorHandler())];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/type/:selected", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var posts, votes, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Post_1.Post.getPostsSetType(req.params.selected)];
            case 1:
                posts = _a.sent();
                return [4 /*yield*/, userVotes(res.locals.user)];
            case 2:
                votes = _a.sent();
                res.json({ html: createTemplate('posts', { posts: posts, votes: votes }) });
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                console.log(err_4);
                return [2 /*return*/, next(new errorHandler_1.ErrorHandler())];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/order/:selected", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var posts, votes, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Post_1.Post.getPostsSetOrder(req.params.selected)];
            case 1:
                posts = _a.sent();
                return [4 /*yield*/, userVotes(res.locals.user)];
            case 2:
                votes = _a.sent();
                res.json({ html: createTemplate('posts', { posts: posts, votes: votes }) });
                return [3 /*break*/, 4];
            case 3:
                err_5 = _a.sent();
                console.log(err_5);
                return [2 /*return*/, next(new errorHandler_1.ErrorHandler())];
            case 4: return [2 /*return*/];
        }
    });
}); });
function parseUser(userName) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, User_1.User.isExists(userName)];
                case 1: return [2 /*return*/, (_a.sent()).id];
            }
        });
    });
}
function createTemplate(view, options) {
    var templatePath = path.resolve(__dirname, "../views/".concat(view, ".ejs"));
    var posts_template = ejs.compile(ejs.fileLoader(templatePath, 'utf8'), { filename: templatePath });
    return posts_template(options);
}
function userVotes(user) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!user) return [3 /*break*/, 2];
                    return [4 /*yield*/, Vote_1.Vote.getAllUserVotes(user)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2: return [2 /*return*/, undefined];
            }
        });
    });
}
module.exports = router;
