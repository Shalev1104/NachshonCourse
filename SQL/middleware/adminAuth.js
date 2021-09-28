"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Admin_1 = require("../model/Admin");
var errorHandler_1 = require("../middleware/errorHandler");
module.exports = function (user, req, res, next) {
    user instanceof Admin_1.Admin ? next() : next(new errorHandler_1.ErrorHandler(403));
};
