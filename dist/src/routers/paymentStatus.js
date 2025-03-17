"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pug_1 = __importDefault(require("pug"));
const router = (0, express_1.Router)();
router.get('/:status', (req, res) => {
    const { status } = req.params;
    const { errorMessage } = req.query;
    if (status === 'success') {
        const html = pug_1.default.renderFile('./src/templates/paymentResponse.pug', {
            status: true,
        });
        res.send(html);
    }
    else {
        const html = pug_1.default.renderFile('./src/templates/paymentResponse.pug', {
            status: false,
            errorMessage,
        });
        res.send(html);
    }
});
exports.default = router;
