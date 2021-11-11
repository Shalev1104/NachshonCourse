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
var auth_1 = require("firebase/auth");
var express_1 = __importDefault(require("express"));
var firebaseAuth_1 = require("../controller/firebaseAuth");
var router = express_1.default.Router();
router.post(['/login/email', '/login/google', '/login/github', '/login/facebook'], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    function getCredential() {
        switch (req.path) {
            case '/login/google':
                return auth_1.GoogleAuthProvider.credential(token);
            case '/login/facebook':
                return auth_1.FacebookAuthProvider.credential(token);
            case '/login/github':
                return auth_1.GithubAuthProvider.credential(token);
            default:
                return auth_1.EmailAuthProvider.credential(email, password);
        }
    }
    var _a, token, email, password, _b, _c, err_1;
    var _d;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _a = req.body, token = _a.token, email = _a.email, password = _a.password;
                if (!token && !(email || password))
                    return [2 /*return*/, res.status(400).json({ message: 'missing fields' })];
                _f.label = 1;
            case 1:
                _f.trys.push([1, 4, , 5]);
                _c = (_b = res.status(200)).json;
                _d = {};
                return [4 /*yield*/, (0, firebaseAuth_1.login)(getCredential())];
            case 2: return [4 /*yield*/, ((_e = (_f.sent())) === null || _e === void 0 ? void 0 : _e.user.getIdToken())];
            case 3: return [2 /*return*/, _c.apply(_b, [(_d.token = _f.sent(), _d)])];
            case 4:
                err_1 = _f.sent();
                return [2 /*return*/, res.status(500).json(err_1.code)];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post('/register', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, _b, _c, err_2;
    var _d;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                if (!email || !password)
                    return [2 /*return*/, res.status(400).json({ message: 'missing fields' })];
                _f.label = 1;
            case 1:
                _f.trys.push([1, 4, , 5]);
                _c = (_b = res.status(200)).json;
                _d = {};
                return [4 /*yield*/, (0, firebaseAuth_1.register)(email, password)];
            case 2: return [4 /*yield*/, ((_e = (_f.sent()).user) === null || _e === void 0 ? void 0 : _e.getIdToken())];
            case 3: return [2 /*return*/, _c.apply(_b, [(_d.token = _f.sent(), _d)])];
            case 4:
                err_2 = _f.sent();
                return [2 /*return*/, res.status(500).json(err_2.code)];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.get('/logout', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        (0, firebaseAuth_1.logout)().then(function () { return res.status(200).json({ logout: true }); })
            .catch(function () { return res.status(500).json({ logout: false }); });
        return [2 /*return*/];
    });
}); });
module.exports = router;
