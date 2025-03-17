"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const offerController_1 = __importDefault(require("../controllers/offerController"));
const router = (0, express_1.Router)();
router.get('/apple-pay/accept/:transactionId', offerController_1.default.applepayAcceptOffer);
exports.default = router;
