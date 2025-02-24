import { Request, Response, NextFunction } from 'express';
import response from '../utils/response';
import vehicleDetailsService from '../services/vehicleDetailsService';
import { modelNameType } from '../types/vehicleDetailsType';
import CustomRequest from '../interfaces/customRequest';
import {
  serializeVehicleDetail,
  serializeVehicleDetails,
} from '../utils/serialization/vehicle.serialization';

class VehicleDetailController {
  static modelName: Record<string, modelNameType> = {
    vehicle_color: 'vehicle_Color',
    vehicle_class: 'vehicle_Class',
    vehicle_type: 'vehicle_Type',
    vehicle_name: 'vehicle_Name',
  };

  async getVehicleColors(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicleColors = await vehicleDetailsService.getVehicleDetails(
        VehicleDetailController.modelName.vehicle_color,
      );
      const { language, skipLang } = req as CustomRequest;
      response(res, 200, {
        status: true,
        message: 'Vehicle colors fetched successfully',
        result: skipLang
          ? vehicleColors
          : serializeVehicleDetails(vehicleColors, language),
      });
    } catch (error) {
      next(error);
    }
  }

  async getVehicleColorById(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicleColor = await vehicleDetailsService.getVehicleDetailById(
        VehicleDetailController.modelName.vehicle_color,
        +req.params.id,
      );
      const { language, skipLang } = req as CustomRequest;
      response(res, 200, {
        status: true,
        message: 'Vehicle color fetched successfully',
        result: skipLang
          ? vehicleColor
          : serializeVehicleDetail(vehicleColor, language),
      });
    } catch (error) {
      next(error);
    }
  }

  async createVehicleColor(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicleColor = await vehicleDetailsService.createVehicleDetail(
        VehicleDetailController.modelName.vehicle_color,
        req.body,
      );
      response(res, 201, {
        status: true,
        message: 'Vehicle color created successfully',
        result: vehicleColor,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateVehicleColor(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicleColor = await vehicleDetailsService.updateVehicleDetail(
        VehicleDetailController.modelName.vehicle_color,
        +req.params.id,
        req.body,
      );
      response(res, 200, {
        status: true,
        message: 'Vehicle color updated successfully',
        result: vehicleColor,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteVehicleColor(req: Request, res: Response, next: NextFunction) {
    try {
      await vehicleDetailsService.deleteVehicleDetail(
        VehicleDetailController.modelName.vehicle_color,
        +req.params.id,
      );
      response(res, 204, {
        status: true,
        message: 'Vehicle color deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getVehicleClasses(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicleClasses = await vehicleDetailsService.getVehicleDetails(
        VehicleDetailController.modelName.vehicle_class,
      );
      const { language, skipLang } = req as CustomRequest;
      response(res, 200, {
        status: true,
        message: 'Vehicle classes fetched successfully',
        result: skipLang
          ? vehicleClasses
          : serializeVehicleDetails(vehicleClasses, language),
      });
    } catch (error) {
      next(error);
    }
  }

  async getVehicleClassById(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicleClass = await vehicleDetailsService.getVehicleDetailById(
        VehicleDetailController.modelName.vehicle_class,
        +req.params.id,
      );
      const { language, skipLang } = req as CustomRequest;
      response(res, 200, {
        status: true,
        message: 'Vehicle class fetched successfully',
        result: skipLang
          ? vehicleClass
          : serializeVehicleDetail(vehicleClass, language),
      });
    } catch (error) {
      next(error);
    }
  }

  async createVehicleClass(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicleClass = await vehicleDetailsService.createVehicleDetail(
        VehicleDetailController.modelName.vehicle_class,
        req.body,
      );
      response(res, 201, {
        status: true,
        message: 'Vehicle class created successfully',
        result: vehicleClass,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateVehicleClass(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicleClass = await vehicleDetailsService.updateVehicleDetail(
        VehicleDetailController.modelName.vehicle_class,
        +req.params.id,
        req.body,
      );
      response(res, 200, {
        status: true,
        message: 'Vehicle class updated successfully',
        result: vehicleClass,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteVehicleClass(req: Request, res: Response, next: NextFunction) {
    try {
      await vehicleDetailsService.deleteVehicleDetail(
        VehicleDetailController.modelName.vehicle_class,
        +req.params.id,
      );
      response(res, 204, {
        status: true,
        message: 'Vehicle class deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getVehicleTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicleTypes = await vehicleDetailsService.getVehicleDetails(
        VehicleDetailController.modelName.vehicle_type,
      );
      const { language, skipLang } = req as CustomRequest;
      response(res, 200, {
        status: true,
        message: 'Vehicle types fetched successfully',
        result: skipLang
          ? vehicleTypes
          : serializeVehicleDetails(vehicleTypes, language),
      });
    } catch (error) {
      next(error);
    }
  }

  async getVehicleTypeById(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicleType = await vehicleDetailsService.getVehicleDetailById(
        VehicleDetailController.modelName.vehicle_type,
        +req.params.id,
      );
      const { language, skipLang } = req as CustomRequest;
      response(res, 200, {
        status: true,
        message: 'Vehicle type fetched successfully',
        result: skipLang
          ? vehicleType
          : serializeVehicleDetail(vehicleType, language),
      });
    } catch (error) {
      next(error);
    }
  }

  async createVehicleType(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicleType = await vehicleDetailsService.createVehicleType(
        VehicleDetailController.modelName.vehicle_type,
        {
          ...req.body,
          file_path: req.file!.path,
        },
      );
      response(res, 201, {
        status: true,
        message: 'Vehicle type created successfully',
        result: vehicleType,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateVehicleType(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicleType = await vehicleDetailsService.updateVehicleType(
        VehicleDetailController.modelName.vehicle_type,
        +req.params.id,
        {
          ...req.body,
          file_path: req.file ? req.file.path : undefined,
        },
      );
      response(res, 200, {
        status: true,
        message: 'Vehicle type updated successfully',
        result: vehicleType,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteVehicleType(req: Request, res: Response, next: NextFunction) {
    try {
      await vehicleDetailsService.deleteVehicleDetail(
        VehicleDetailController.modelName.vehicle_type,
        +req.params.id,
      );
      response(res, 204, {
        status: true,
        message: 'Vehicle type deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getVehicleNames(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicleNames = await vehicleDetailsService.getVehicleDetails(
        VehicleDetailController.modelName.vehicle_name,
      );
      const { language, skipLang } = req as CustomRequest;
      response(res, 200, {
        status: true,
        message: 'Vehicle names fetched successfully',
        result: skipLang
          ? vehicleNames
          : serializeVehicleDetails(vehicleNames, language),
      });
    } catch (error) {
      next(error);
    }
  }

  async getVehicleNameById(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicleName = await vehicleDetailsService.getVehicleDetailById(
        VehicleDetailController.modelName.vehicle_name,
        +req.params.id,
      );
      const { language, skipLang } = req as CustomRequest;
      response(res, 200, {
        status: true,
        message: 'Vehicle name fetched successfully',
        result: skipLang
          ? vehicleName
          : serializeVehicleDetail(vehicleName, language),
      });
    } catch (error) {
      next(error);
    }
  }

  async createVehicleName(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicleName = await vehicleDetailsService.createVehicleDetail(
        VehicleDetailController.modelName.vehicle_name,
        req.body,
      );
      response(res, 201, {
        status: true,
        message: 'Vehicle name created successfully',
        result: vehicleName,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateVehicleName(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicleName = await vehicleDetailsService.updateVehicleDetail(
        VehicleDetailController.modelName.vehicle_name,
        +req.params.id,
        req.body,
      );
      response(res, 200, {
        status: true,
        message: 'Vehicle name updated successfully',
        result: vehicleName,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteVehicleName(req: Request, res: Response, next: NextFunction) {
    try {
      await vehicleDetailsService.deleteVehicleDetail(
        VehicleDetailController.modelName.vehicle_name,
        +req.params.id,
      );
      response(res, 204, {
        status: true,
        message: 'Vehicle name deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllVehicleDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicleDetail = await vehicleDetailsService.getAllVehicleDetails();
      const { language, skipLang } = req as CustomRequest;

      response(res, 200, {
        status: true,
        message: 'Vehicle details fetched successfully',
        result: {
          ...vehicleDetail,
          vehicleColor: skipLang
            ? vehicleDetail.vehicleColor
            : serializeVehicleDetails(vehicleDetail.vehicleColor, language),
          vehicleClass: skipLang
            ? vehicleDetail.vehicleClass
            : serializeVehicleDetails(vehicleDetail.vehicleClass, language),
          vehicleTypes: skipLang
            ? vehicleDetail.vehicleTypes
            : serializeVehicleDetails(vehicleDetail.vehicleTypes, language),
          vehicleName: skipLang
            ? vehicleDetail.vehicleName
            : serializeVehicleDetails(vehicleDetail.vehicleName, language),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async createVehicleProductionStartYear(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const vehicleProductionStartYear =
        await vehicleDetailsService.createVehicleProductionStartYear(
          req.body.start_year,
        );
      response(res, 201, {
        status: true,
        message: 'Vehicle production start year created successfully',
        result: vehicleProductionStartYear,
      });
    } catch (error) {
      next(error);
    }
  }

  async getVehicleProductionStartYear(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const vehicleProductionStartYear =
        await vehicleDetailsService.getVehicleProductionStartYear();
      response(res, 200, {
        status: true,
        message: 'Vehicle production start year fetched successfully',
        result: vehicleProductionStartYear,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateVehicleProductionStartYear(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const vehicleProductionStartYear =
        await vehicleDetailsService.updateVehicleProductionStartYear(
          req.body.start_year,
        );
      response(res, 200, {
        status: true,
        message: 'Vehicle production start year updated successfully',
        result: vehicleProductionStartYear,
      });
    } catch (error) {
      next(error);
    }
  }
}

const vehicleDetailController = new VehicleDetailController();
export default vehicleDetailController;
