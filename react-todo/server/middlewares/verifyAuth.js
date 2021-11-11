"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var google_auth_library_1 = require("google-auth-library");
function verifyFirebaseToken(req, res, next) {
    var _a;
    try {
        var token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token)
            throw new Error();
        var googleAppId = process.env.GOOGLE_APP_ID;
        new google_auth_library_1.OAuth2Client(googleAppId).verifyIdToken({
            idToken: token,
            audience: googleAppId
        })
            .then(function () { return next(); })
            .catch(function () { return res.status(403).json({ error: "Access denied" }); });
    }
    catch (_b) {
        res.status(401).json({ error: "Not authenticated" });
    }
}
exports.default = verifyFirebaseToken;
