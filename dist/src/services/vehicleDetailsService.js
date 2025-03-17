"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../prisma/client"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
class VehicleDetailsService {
    async checkNameExists(modelName, data, id) {
        // @ts-ignore
        const vehicleDetail = await client_1.default[modelName].findMany({
            where: {
                id: id ? { not: id } : undefined,
                OR: [
                    {
                        en_name: {
                            contains: data.en_name,
                            mode: 'insensitive',
                        },
                    },
                    {
                        ar_name: {
                            contains: data.ar_name,
                            mode: 'insensitive',
                        },
                    },
                ],
            },
        });
        if (vehicleDetail.length > 0) {
            throw new ApiError_1.default(`${modelName.replace('_', ' ')} already exists`, 400);
        }
    }
    async getVehicleDetails(modelName) {
        // @ts-ignore
        return client_1.default[modelName].findMany();
    }
    async getVehicleDetailById(modelName, id) {
        // @ts-ignore
        const vehicleDetail = await client_1.default[modelName].findUnique({ where: { id } });
        if (!vehicleDetail) {
            throw new ApiError_1.default(`${modelName.replace('_', ' ')} not found`, 404);
        }
        return vehicleDetail;
    }
    async createVehicleDetail(modelName, data) {
        await this.checkNameExists(modelName, data);
        // @ts-ignore
        return client_1.default[modelName].create({ data });
    }
    async updateVehicleDetail(modelName, id, data) {
        await this.getVehicleDetailById(modelName, id);
        await this.checkNameExists(modelName, data, id);
        // @ts-ignore
        return client_1.default[modelName].update({ where: { id }, data });
    }
    async deleteVehicleDetail(modelName, id) {
        await this.getVehicleDetailById(modelName, id);
        // @ts-ignore
        return client_1.default[modelName].delete({ where: { id } });
    }
    async createVehicleProductionStartYear(startYear) {
        const vehicleProductionStartYear = await client_1.default.vehicle_Production_Start_Year.findFirst();
        if (vehicleProductionStartYear) {
            throw new ApiError_1.default('Vehicle production start year already exists', 400);
        }
        return client_1.default.vehicle_Production_Start_Year.create({
            data: { start_year: startYear },
        });
    }
    async createVehicleType(modelName, data) {
        await this.checkNameExists(modelName, data);
        return client_1.default.vehicle_Type.create({ data });
    }
    async updateVehicleType(modelName, id, data) {
        await this.getVehicleDetailById(modelName, id);
        await this.checkNameExists(modelName, data, id);
        return client_1.default.vehicle_Type.update({ where: { id }, data });
    }
    async getVehicleProductionStartYear() {
        const vehicleProductionStartYear = await client_1.default.vehicle_Production_Start_Year.findFirst();
        if (!vehicleProductionStartYear) {
            throw new ApiError_1.default('Vehicle production start year not found', 404);
        }
        return vehicleProductionStartYear;
    }
    async updateVehicleProductionStartYear(startYear) {
        const vehicleProductionStartYear = await client_1.default.vehicle_Production_Start_Year.findFirst();
        if (!vehicleProductionStartYear) {
            throw new ApiError_1.default('Vehicle production start year not found', 404);
        }
        return client_1.default.vehicle_Production_Start_Year.update({
            where: { start_year: vehicleProductionStartYear.start_year },
            data: { start_year: startYear },
        });
    }
    async getAllVehicleDetails() {
        const vehicleDetail = {
            vehicleColor: await client_1.default.vehicle_Color.findMany(),
            vehicleClass: await client_1.default.vehicle_Class.findMany(),
            vehicleTypes: await client_1.default.vehicle_Type.findMany(),
            vehicleName: await client_1.default.vehicle_Name.findMany(),
            start_year: (await client_1.default.vehicle_Production_Start_Year.findFirst())
                .start_year,
        };
        return vehicleDetail;
    }
}
const vehicleDetailsService = new VehicleDetailsService();
exports.default = vehicleDetailsService;
