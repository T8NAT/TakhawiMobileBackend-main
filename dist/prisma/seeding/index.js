"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const citySeeding_1 = __importDefault(require("./citySeeding"));
const hobbiesSeeding_1 = __importDefault(require("./hobbiesSeeding"));
const reasonsSeeding_1 = __importDefault(require("./reasonsSeeding"));
const seeding = async () => {
    await (0, citySeeding_1.default)();
    await (0, hobbiesSeeding_1.default)();
    await (0, reasonsSeeding_1.default)();
};
exports.default = seeding;
