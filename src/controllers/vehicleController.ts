import { Request, Response, NextFunction } from 'express';
import { Roles } from '../enum/roles';
import vehicleService from '../services/vehicleService';
import response from '../utils/response';
import CustomRequest from '../interfaces/customRequest';
import {
  serializeVehicle,
  serializeVehicles,
} from '../utils/serialization/vehicle.serialization';
import { FileMap } from '../types/files';

class VehicleController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, temp_id, language, skipLang } = req as CustomRequest;
      const vehicle = await vehicleService.create(
        { ...req.body, driverId: user },
        temp_id,
      );
      response(res, 201, {
        status: true,
        message: 'Vehicle created successfully',
        result: skipLang ? vehicle : serializeVehicle(vehicle, language),
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { language, skipLang } = req as CustomRequest;
      const { pagination, data } = await vehicleService.getAll(req.query);
      response(res, 200, {
        status: true,
        message: 'Vehicles fetched successfully',
        pagination,
        result: skipLang ? data : serializeVehicles(data, language),
      });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, role, language, skipLang } = req as CustomRequest;
      const { id } = req.params;
      const vehicle = await vehicleService.getOne(
        +id,
        role === Roles.DRIVER ? user : undefined,
      );
      response(res, 200, {
        status: true,
        message: 'Vehicle fetched successfully',
        result: skipLang ? vehicle : serializeVehicle(vehicle, language),
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, role, language, skipLang } = req as CustomRequest;
      const { id } = req.params;
      const vehicle = await vehicleService.update(
        req.body,
        +id,
        role === Roles.DRIVER ? user : undefined,
      );
      response(res, 200, {
        status: true,
        message: 'Vehicle updated successfully',
        result: skipLang ? vehicle : serializeVehicle(vehicle, language),
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, role } = req as CustomRequest;
      const { id } = req.params;
      await vehicleService.delete(
        +id,
        role === Roles.DRIVER ? user : undefined,
      );
      response(res, 200, {
        status: true,
        message: 'Vehicle deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadVehicleImages(req: Request, res: Response, next: NextFunction) {
    try {
      const { temp_id } = req as CustomRequest;
      const vehicleImages = await vehicleService.uploadVehicleImages(
        temp_id,
        req.files as Express.Multer.File[],
      );
      response(res, 201, {
        status: true,
        message: 'Images uploaded successfully',
        result: vehicleImages,
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadVehicleLicence(req: Request, res: Response, next: NextFunction) {
    try {
      const { temp_id } = req as CustomRequest;
      const vehicleLicence = await vehicleService.uploadVehicleLicence(
        temp_id,
        req.files as Express.Multer.File[],
      );
      response(res, 201, {
        status: true,
        message: 'Images uploaded successfully',
        result: vehicleLicence,
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadVehicleInsurance(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { temp_id } = req as CustomRequest;
      const file_path = req.file!.path;
      const vehicleInsurance = await vehicleService.uploadVehicleInsurance(
        temp_id,
        file_path,
      );
      response(res, 201, {
        status: true,
        message: 'Insurance uploaded successfully',
        result: vehicleInsurance,
      });
    } catch (error) {
      next(error);
    }
  }

  async addNewVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      const vehicle = await vehicleService.addNewVehicle(
        { ...req.body, driverId: user },
        req.files as FileMap,
      );
      response(res, 201, {
        status: true,
        message: 'Vehicle created successfully',
        result: vehicle,
      });
    } catch (error) {
      next(error);
    }
  }
}
const vehicleController = new VehicleController();
export default vehicleController;
