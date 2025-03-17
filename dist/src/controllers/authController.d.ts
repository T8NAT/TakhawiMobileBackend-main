import { NextFunction, Request, Response } from 'express';
declare class AuthController {
    checkPhoneExist(req: Request, res: Response, next: NextFunction): Promise<void>;
    checkEmailExist(req: Request, res: Response, next: NextFunction): Promise<void>;
    signUpUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    login(req: Request, res: Response, next: NextFunction): Promise<void>;
    loginFromMobile(req: Request, res: Response, next: NextFunction): Promise<void>;
    forgetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
    verifyResetCode(req: Request, res: Response, next: NextFunction): Promise<void>;
    resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
    changePassword(req: Request, res: Response, next: NextFunction): Promise<void>;
    sendVerificationCode(req: Request, res: Response, next: NextFunction): Promise<void>;
    verifyPhoneCode(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const authController: AuthController;
export default authController;
