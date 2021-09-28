"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errHandler = exports.ErrorHandler = void 0;
var ErrorHandler = /** @class */ (function () {
    function ErrorHandler(_status, _message) {
        this._status = _status;
        this._message = _message;
        this._messageStatus = '';
        this._status = _status || 500;
        for (var enumMember in StatusCode) {
            if (parseInt(StatusCode[enumMember]) === this._status) {
                this._messageStatus = enumMember;
            }
        }
    }
    Object.defineProperty(ErrorHandler.prototype, "messageStatus", {
        get: function () {
            return this._messageStatus;
        },
        set: function (messageStatus) {
            this._messageStatus = messageStatus;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ErrorHandler.prototype, "message", {
        get: function () {
            return this._message;
        },
        set: function (message) {
            this._message = message;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ErrorHandler.prototype, "status", {
        get: function () {
            return this._status;
        },
        enumerable: false,
        configurable: true
    });
    return ErrorHandler;
}());
exports.ErrorHandler = ErrorHandler;
var StatusCode;
(function (StatusCode) {
    StatusCode["BadRequest"] = "400";
    StatusCode["Conflict"] = "409";
    StatusCode["Forbidden"] = "403";
    StatusCode["NonAuthoritativeInformation"] = "401";
    StatusCode["NotFound"] = "404";
    StatusCode["InternalServerError"] = "500";
})(StatusCode || (StatusCode = {}));
function errHandler(error, req, res, next) {
    res.status(error.status);
    if (error.message)
        return res.json({ error: error.message });
    return res.json({ status: error.messageStatus });
}
exports.errHandler = errHandler;
module.exports = { ErrorHandler: ErrorHandler, errHandler: errHandler };
