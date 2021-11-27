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
exports.User = void 0;
var sql_1 = require("./sql");
var bcrypt_1 = __importDefault(require("bcrypt"));
var User = /** @class */ (function () {
    function User(_userName, _password) {
        this._userName = _userName;
        this._password = _password;
    }
    User.isExists = function (userName) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, sql_1.Model.runQuery("SELECT * FROM ".concat(User.table, " WHERE userName='").concat(userName, "';"))];
                    case 1: return [4 /*yield*/, (_b.sent()).recordset[0]];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3:
                        _a = _b.sent();
                        return [2 /*return*/, undefined];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    User.authenticate = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        _a = user;
                        _c = (_b = bcrypt_1.default).hash;
                        _d = [user._password];
                        return [4 /*yield*/, bcrypt_1.default.genSalt()];
                    case 1: return [4 /*yield*/, _c.apply(_b, _d.concat([_j.sent()]))];
                    case 2:
                        _a._password = _j.sent();
                        _f = (_e = sql_1.Model).insert;
                        _g = [User.table];
                        _h = [user._userName, user._password];
                        return [4 /*yield*/, user.getRoleId()];
                    case 3: return [4 /*yield*/, _f.apply(_e, _g.concat([_h.concat([_j.sent()])]))];
                    case 4: return [2 /*return*/, _j.sent()];
                }
            });
        });
    };
    User.prototype.getRoleId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sql_1.Model.runQuery("SELECT id FROM Roles where Roles.name='".concat(this.constructor.name, "'"))];
                    case 1: return [2 /*return*/, (_a.sent()).recordset[0].id];
                }
            });
        });
    };
    User.login = function (userName, password) {
        return __awaiter(this, void 0, void 0, function () {
            var user, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, User.isExists(userName)];
                    case 1:
                        user = _b.sent();
                        return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
                    case 2:
                        if (!(_b.sent()))
                            return [2 /*return*/, undefined];
                        return [2 /*return*/, user];
                    case 3:
                        _a = _b.sent();
                        return [2 /*return*/, undefined];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.getId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, User.isExists(this._userName)];
                    case 1: return [2 /*return*/, (_a.sent()).id];
                }
            });
        });
    };
    Object.defineProperty(User.prototype, "userName", {
        get: function () {
            return this._userName;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "password", {
        get: function () {
            return this._password;
        },
        enumerable: false,
        configurable: true
    });
    User.table = 'Users';
    return User;
}());
exports.User = User;
module.exports = { User: User };
