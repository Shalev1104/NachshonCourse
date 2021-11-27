"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firestore = exports.auth = void 0;
var firebase_admin_1 = __importDefault(require("firebase-admin"));
var serviceAccount = require('./ServiceAccountKey');
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount)
});
exports.auth = firebase_admin_1.default.auth();
exports.firestore = firebase_admin_1.default.firestore();
