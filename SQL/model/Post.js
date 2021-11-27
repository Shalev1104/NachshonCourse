"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
var sql_1 = require("./sql");
var Post = /** @class */ (function () {
    function Post(_userId, _type, _title, _description) {
        this._userId = _userId;
        this._type = _type;
        this._title = _title;
        this._description = _description;
    }
    Post.create = function (post) {
        return __awaiter(this, void 0, void 0, function () {
            var date, formattedDate, _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        date = new Date(Date.now());
                        formattedDate = (((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear());
                        _b = (_a = sql_1.Model).insert;
                        _c = [Post.table];
                        _d = [post._userId];
                        return [4 /*yield*/, post.getTypeId()];
                    case 1: return [4 /*yield*/, _b.apply(_a, _c.concat([_d.concat([_e.sent(), formattedDate, post._title, post._description])]))];
                    case 2: return [2 /*return*/, _e.sent()];
                }
            });
        });
    };
    Post.prototype.getTypeId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sql_1.Model.runQuery("SELECT id FROM PostType where PostType.type='".concat(this._type, "'"))];
                    case 1: return [2 /*return*/, (_a.sent()).recordset[0].id];
                }
            });
        });
    };
    Post.getPost = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPosts("WHERE po.id=".concat(id))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Post.getPosts = function (where, order) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sql_1.Model.runQuery("\n        SELECT po.id,\n            po.title,\n            CASE WHEN po.description IS NULL THEN '' ELSE po.description END AS description,\n            CONVERT(varchar, po.pDate, 104) AS pDate,\n            pt.type,\n            us.userName,\n            SUM(CASE WHEN vt.isLike = 1 THEN 1 ELSE 0 END) AS upvotes,\n            SUM(CASE WHEN vt.isLike = 0 THEN 1 ELSE 0 END) AS downvotes\nFROM ".concat(Post.table, " po\n     INNER JOIN PostType pt ON po.typeId = pt.id\n     INNER JOIN Users us ON po.userId = us.id\n     LEFT OUTER JOIN Votes vt ON vt.postId = po.id\n").concat(where ? where : '', "\n\nGROUP BY po.id,\n         po.pDate,\n         po.title,\n         CASE WHEN po.description IS NULL THEN '' ELSE po.description END,\n         pt.type,\n         us.userName\n").concat(order ? order : '', ";\n         "))];
                    case 1: return [2 /*return*/, ((_a.sent()).recordsets[0])];
                }
            });
        });
    };
    Post.getPostsSetSearch = function (search) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        search == "''" ? delete this.filters.search
                            : this.filters.search = "(title like '%".concat(search, "%' OR description like '%").concat(search, "%')");
                        return [4 /*yield*/, this.getPosts(this.getFilters(), this.order)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Post.getPostsSetUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.filters.user = "us.userName = '".concat(user, "'");
                        return [4 /*yield*/, this.getPosts(this.getFilters(), this.order)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Post.getPostsSetType = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        type == "''" ? delete this.filters.type
                            : this.filters.type = "pt.type='".concat(type, "'");
                        return [4 /*yield*/, this.getPosts(this.getFilters(), this.order)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Post.getPostsSetOrder = function (order) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.order = 'order by ';
                        switch (order) {
                            case 'newest':
                                this.order += "po.pDate DESC";
                                break;
                            case 'oldest':
                                this.order += "po.pDate ASC";
                                break;
                            case 'popular':
                                this.order += "upvotes DESC";
                        }
                        return [4 /*yield*/, this.getPosts(this.getFilters(), this.order)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Post.getFilters = function () {
        if (Object.values(this.filters).length > 0)
            return "WHERE ".concat(Object.values(this.filters).join("AND "));
        return '';
    };
    Post.reset = function () {
        var _this = this;
        Object.keys(this.filters).forEach((function (k) { return delete _this.filters[k]; }));
        this.order = '';
    };
    Object.defineProperty(Post.prototype, "title", {
        get: function () {
            return this._title;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Post.prototype, "description", {
        get: function () {
            return this._description;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Post.prototype, "userId", {
        get: function () {
            return this._userId;
        },
        enumerable: false,
        configurable: true
    });
    Post.table = 'Posts';
    Post.filters = {};
    return Post;
}());
exports.Post = Post;
module.exports = { Post: Post };
