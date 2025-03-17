"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
const languages_1 = require("../enum/languages");
class MsegatService {
}
_a = MsegatService;
MsegatService.BASE_URL = 'www.msegat.com';
MsegatService.TIMEOUT = 5000;
MsegatService.request = (path, data) => new Promise((resolve, reject) => {
    const options = {
        hostname: _a.BASE_URL,
        path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: _a.TIMEOUT,
    };
    const jsonData = JSON.stringify(data);
    const req = https_1.default.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => {
            responseData += chunk;
        });
        res.on('end', () => {
            if (res.statusCode === 200) {
                try {
                    const jsonResponse = JSON.parse(responseData);
                    resolve(jsonResponse);
                }
                catch (error) {
                    console.error(error);
                    reject(console.error(`Failed to parse JSON response: ${responseData}`));
                }
            }
            else {
                reject(console.error(`Request failed with status ${res.statusCode}: ${responseData}`));
            }
        });
    });
    req.on('error', (error) => {
        reject(console.error(`Request failed: ${error.message}`));
    });
    req.write(jsonData);
    req.end();
});
MsegatService.sendOTP = async (phoneNumber, lang) => {
    const data = {
        lang: lang === languages_1.Languages.ARABIC ? 'Ar' : 'En',
        userName: process.env.MSEGAT_USERNAME,
        apiKey: process.env.MSEGAT_API_KEY,
        number: phoneNumber,
        userSender: process.env.MSEGAT_SENDER_NAME,
    };
    return _a.request('/gw/sendOTPCode.php', data);
};
MsegatService.verifyOTP = async (verificationData) => {
    const data = {
        lang: verificationData.lang === languages_1.Languages.ARABIC ? 'Ar' : 'En',
        userName: process.env.MSEGAT_USERNAME,
        apiKey: process.env.MSEGAT_API_KEY,
        code: verificationData.code,
        id: verificationData.id,
        userSender: process.env.MSEGAT_SENDER_NAME,
    };
    return _a.request('/gw/verifyOTPCode.php', data);
};
exports.default = MsegatService;
