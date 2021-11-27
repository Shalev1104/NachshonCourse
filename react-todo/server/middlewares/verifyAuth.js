"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var firebase_admin_1 = require("firebase-admin");
function verifyFirebaseToken(req, res, next) {
    var _a;
    try {
        var token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token)
            throw new Error();
        (0, firebase_admin_1.auth)().verifyIdToken(token)
            .then(function () { return next(); })
            .catch(function (err) { return res.status(403).json(err.message); });
    }
    catch (_b) {
        res.status(401).json({ error: "Not authenticated" });
    }
}
exports.default = verifyFirebaseToken;
