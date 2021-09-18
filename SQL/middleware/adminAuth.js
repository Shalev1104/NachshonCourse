"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Admin_1 = require("../model/Admin");
module.exports = function (user, req, res, next) {
    user instanceof Admin_1.Admin ? next() : console.log('error');
};
