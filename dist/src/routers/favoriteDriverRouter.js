"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const favoriteDriverController_1 = __importDefault(require("../controllers/favoriteDriverController"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = (0, express_1.Router)();
router.use(auth_1.default);
router
    .route('/:driverId')
    .post(favoriteDriverController_1.default.addToFavorite)
    .delete(favoriteDriverController_1.default.removeFromFavorite);
router.route('/').get(favoriteDriverController_1.default.getFavoriteDrivers);
exports.default = router;
