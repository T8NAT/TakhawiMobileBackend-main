"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_schedule_1 = __importDefault(require("node-schedule"));
const warningService_1 = __importDefault(require("../services/warningService"));
const vehicleService_1 = __importDefault(require("../services/vehicleService"));
// Running scheduled tasks at 12 AM every day
const scheduleDailyCleanupTasks = node_schedule_1.default.scheduleJob('0 0 * * *', async () => {
    await warningService_1.default.deleteExpiredWarnings();
    await vehicleService_1.default.cleanupOrphanUploads();
});
exports.default = scheduleDailyCleanupTasks;
