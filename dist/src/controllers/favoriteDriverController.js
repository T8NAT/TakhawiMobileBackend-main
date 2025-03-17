"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const favoriteDriverService_1 = __importDefault(require("../services/favoriteDriverService"));
const response_1 = __importDefault(require("../utils/response"));
class FavoriteDriverController {
    async addToFavorite(req, res, next) {
        try {
            const { user } = req;
            await favoriteDriverService_1.default.addToFavorite(user, +req.params.driverId);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Driver added to favorites',
            });
        }
        catch (error) {
            next(error);
        }
    }
    async removeFromFavorite(req, res, next) {
        try {
            const { user } = req;
            await favoriteDriverService_1.default.removeFromFavorite(user, +req.params.driverId);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Driver removed from favorites',
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getFavoriteDrivers(req, res, next) {
        try {
            const { user } = req;
            const { data, pagination } = await favoriteDriverService_1.default.getFavoriteDrivers(user, req.query);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Favorite drivers fetched',
                pagination,
                result: data,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
const favoriteDriverController = new FavoriteDriverController();
exports.default = favoriteDriverController;
