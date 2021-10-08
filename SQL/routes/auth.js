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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var User_1 = require("../model/User");
var Admin_1 = require("../model/Admin");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var errorHandler_1 = require("../middleware/errorHandler");
var csurf_1 = __importDefault(require("csurf"));
function generateToken(user) {
    var secretType = user instanceof Admin_1.Admin ? process.env.ADMIN_SECRET : process.env.USER_SECRET;
    return jsonwebtoken_1.default.sign({ user: user.userName }, secretType, { expiresIn: process.env.JWT_EXPIRE });
}
var router = express_1.default.Router();
var csrfProtection = (0, csurf_1.default)({ cookie: true });
router.get("/register", csrfProtection, function (req, res) {
    res.render('register', { title: 'Register', action: '/user/register', csrfToken: req.csrfToken() });
});
router.get("/login", csrfProtection, function (req, res) {
    res.render('login', { title: 'Login', action: '/user/login', csrfToken: req.csrfToken() });
});
router.post('/register', csrfProtection, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, role, user, token, _b, _c, err_1;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 4, , 5]);
                _a = req.body, username = _a.username, password = _a.password, role = _a.role;
                return [4 /*yield*/, User_1.User.isExists(username)];
            case 1:
                if (_e.sent())
                    return [2 /*return*/, next(new errorHandler_1.ErrorHandler(409, "username already exists"))];
                user = (role == 'ADMIN' ? new Admin_1.Admin(username, password) : new User_1.User(username, password));
                return [4 /*yield*/, User_1.User.authenticate(user)];
            case 2:
                if (!(_e.sent())) {
                    throw new Error('Unable to insert fields');
                }
                token = generateToken(user);
                res.cookie('jwt', token, { httpOnly: true });
                _c = (_b = res.status(201)).json;
                _d = {};
                return [4 /*yield*/, user.getId()];
            case 3: return [2 /*return*/, _c.apply(_b, [(_d.user = _e.sent(), _d)])];
            case 4:
                err_1 = _e.sent();
                return [2 /*return*/, next(new errorHandler_1.ErrorHandler(400, err_1.message))];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post('/login', csrfProtection, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, user, token, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, username = _a.username, password = _a.password;
                return [4 /*yield*/, User_1.User.login(username, password)];
            case 1:
                user = _b.sent();
                if (typeof user == 'undefined')
                    return [2 /*return*/, next(new errorHandler_1.ErrorHandler(401, "username or password incorrect"))];
                token = generateToken(user);
                res.cookie('jwt', token, { httpOnly: true });
                return [2 /*return*/, res.status(200).json({ user: user.id })];
            case 2:
                err_2 = _b.sent();
                return [2 /*return*/, next(new errorHandler_1.ErrorHandler(400, err_2.message))];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/logout', function (req, res) {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
});
router.use('/:user/posts/', require('./posts'));
module.exports = router;
