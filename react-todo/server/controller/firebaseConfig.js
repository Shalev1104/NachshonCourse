"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firestore = exports.auth = void 0;
// Import the functions you need from the SDKs you need
var app_1 = __importDefault(require("firebase/compat/app"));
require("firebase/compat/auth");
require("firebase/compat/firestore");
require('dotenv').config();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || "AIzaSyDytW4NDqjKyhEZm-fznAdFVgm1z1QU9KA",
    authDomain: process.env.AUTH_DOMAIN || "react-todo-c07c3.firebaseapp.com",
    projectId: process.env.PROJECT_ID || "react-todo-c07c3",
    storageBucket: process.env.STORAGE_BUCKET || "react-todo-c07c3.appspot.com",
    messagingSenderId: process.env.MESSAGING_SENDER_ID || "832999638457",
    appId: process.env.APP_ID || "1:832999638457:web:f277ea628c387c6516e268",
    measurementId: process.env.MEASURMENT_ID || "G-T984SLNR6Q"
};
// Initialize Firebase
app_1.default.initializeApp(firebaseConfig);
exports.auth = app_1.default.auth();
exports.firestore = app_1.default.firestore();
