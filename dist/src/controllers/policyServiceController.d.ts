import { Request, Response, NextFunction } from 'express';
declare class PolicyServiceController {
    createPrivacyPolicy(req: Request, res: Response, next: NextFunction): Promise<void>;
    updatePrivacyPolicy(req: Request, res: Response, next: NextFunction): Promise<void>;
    getPrivacyPolicy(req: Request, res: Response, next: NextFunction): Promise<void>;
    createTermsAndConditions(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateTermsAndConditions(req: Request, res: Response, next: NextFunction): Promise<void>;
    getTermsAndConditions(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const policyServiceController: PolicyServiceController;
export default policyServiceController;
