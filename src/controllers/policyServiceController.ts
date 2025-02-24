import { Request, Response, NextFunction } from 'express';
import policyServiceService from '../services/policyServiceService';
import response from '../utils/response';
import { serializePolicyService } from '../utils/serialization/policyService.serialization';
import CustomRequest from '../interfaces/customRequest';

class PolicyServiceController {
  async createPrivacyPolicy(req: Request, res: Response, next: NextFunction) {
    try {
      const policyService = await policyServiceService.createPrivacyPolicy(
        req.body,
      );
      response(res, 201, {
        status: true,
        message: 'Privacy policy created successfully',
        result: policyService,
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePrivacyPolicy(req: Request, res: Response, next: NextFunction) {
    try {
      const policyService = await policyServiceService.updatePrivacyPolicy(
        req.body,
      );
      response(res, 200, {
        status: true,
        message: 'Privacy policy updated successfully',
        result: policyService,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPrivacyPolicy(req: Request, res: Response, next: NextFunction) {
    try {
      const { language, skipLang } = req as CustomRequest;
      const policyService = await policyServiceService.getPrivacyPolicy();
      response(res, 200, {
        status: true,
        message: 'Privacy policy retrieved successfully',
        result: skipLang
          ? policyService
          : serializePolicyService(policyService, language),
      });
    } catch (error) {
      next(error);
    }
  }

  async createTermsAndConditions(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const termsAndConditions =
        await policyServiceService.createTermsAndConditions(req.body);
      response(res, 201, {
        status: true,
        message: 'Terms and conditions created successfully',
        result: termsAndConditions,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTermsAndConditions(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const termsAndConditions =
        await policyServiceService.updateTermsAndConditions(req.body);
      response(res, 200, {
        status: true,
        message: 'Terms and conditions updated successfully',
        result: termsAndConditions,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTermsAndConditions(req: Request, res: Response, next: NextFunction) {
    try {
      const { language, skipLang } = req as CustomRequest;
      const termsAndConditions =
        await policyServiceService.getTermsAndConditions();
      response(res, 200, {
        status: true,
        message: 'Terms and conditions retrieved successfully',
        result: skipLang
          ? termsAndConditions
          : serializePolicyService(termsAndConditions, language),
      });
    } catch (error) {
      next(error);
    }
  }
}
const policyServiceController = new PolicyServiceController();
export default policyServiceController;
