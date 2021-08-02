"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRefreshToken = exports.createRefreshToken = exports.createAccessToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const createAccessToken = (user) => {
    return jsonwebtoken_1.sign({ userId: user.id }, process.env.ACCESS_SECRET, {
        expiresIn: '15m',
    });
};
exports.createAccessToken = createAccessToken;
const createRefreshToken = (user) => {
    return jsonwebtoken_1.sign({ userId: user.id, tokenVersion: user.tokenVersion }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
};
exports.createRefreshToken = createRefreshToken;
const sendRefreshToken = (res, refreshToken) => {
    const expiresOn = new Date();
    expiresOn.setTime(expiresOn.getTime() + 3600000 * 24 * 7);
    res.cookie('jid', refreshToken, {
        httpOnly: true,
        path: '/refresh_token',
        expires: expiresOn,
    });
};
exports.sendRefreshToken = sendRefreshToken;
//# sourceMappingURL=tokenFunctions.js.map