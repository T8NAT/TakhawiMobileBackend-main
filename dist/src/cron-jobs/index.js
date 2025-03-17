"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-expressions */
const rejectOffers_1 = __importDefault(require("./rejectOffers"));
const tripReminder_1 = __importDefault(require("./tripReminder"));
const scheduleDailyCleanupTasks_1 = __importDefault(require("./scheduleDailyCleanupTasks"));
const terminateVipTrips_1 = __importDefault(require("./terminateVipTrips"));
const cronJobs = () => {
    rejectOffers_1.default;
    tripReminder_1.default;
    scheduleDailyCleanupTasks_1.default;
    terminateVipTrips_1.default;
};
exports.default = cronJobs;
