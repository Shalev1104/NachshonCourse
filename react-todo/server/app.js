"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
require('dotenv').config();
var app = (0, express_1.default)();
var port = process.env.PORT || 4000;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use('/users/:userId/todos', require('./routes/todos'));
app.use(require('./routes/oauth'));
app.listen(port, function () {
    console.log("listening to port : ".concat(port));
});
