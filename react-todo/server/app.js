"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
require('dotenv').config();
var app = (0, express_1.default)();
var port = process.env.PORT || 4000;
app.use(express_1.default.json());
app.use('/todos', require('./routes/todos'));
app.use('/users', require('./routes/users'));
app.listen(port, function () {
    console.log("listening to port : " + port);
});
