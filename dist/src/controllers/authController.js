"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authService_1 = __importDefault(require("../services/authService"));
const response_1 = __importDefault(require("../utils/response"));
const tripService_1 = __importDefault(require("../services/tripService"));
const activeTrip_serialization_1 = require("../utils/serialization/activeTrip.serialization");
const signToken_1 = require("../utils/signToken");
const roles_1 = require("../enum/roles");
const event_listner_1 = require("../utils/event-listner");
class AuthController {
    async checkPhoneExist(req, res, next) {
        try {
            const exist = await authService_1.default.checkUserExist('phone', req.body.phone);
            const message = exist ? 'Phone exist' : 'Phone does not exist';
            (0, response_1.default)(res, 200, { status: true, message, result: exist });
        }
        catch (error) {
            next(error);
        }
    }
    async checkEmailExist(req, res, next) {
        try {
            const exist = await authService_1.default.checkUserExist('email', req.body.email);
            const message = exist ? 'Email exist' : 'Email does not exist';
            (0, response_1.default)(res, 200, { status: true, message, result: exist });
        }
        catch (error) {
            next(error);
        }
    }
    async signUpUser(req, res, next) {
        try {
            if (req.file) {
                req.body.avatar = req.file.path;
            }
            const user = await authService_1.default.signUp(req.body);
            (0, response_1.default)(res, 201, { status: true, message: 'Account created successfully!', result: user });
            event_listner_1.customEventEmitter.emit('user-signup', user);
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const user = await authService_1.default.login(req.body);
            const tokens = (0, signToken_1.generateTokens)(user);
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Login successful!',
                result: {
                    ...tokens,
                    user,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async loginFromMobile(req, res, next) {
        try {
            const user = await authService_1.default.login(req.body);
            const role = user.role === roles_1.Roles.DRIVER ? roles_1.Roles.DRIVER : roles_1.Roles.USER;
            const activeTrip = await tripService_1.default.getActiveTrip(user.id, role);
            const tokens = (0, signToken_1.generateTokens)({
                ...user,
                role,
            });
            (0, response_1.default)(res, 200, {
                status: true,
                message: 'Login successful!',
                result: {
                    ...tokens,
                    user: {
                        ...user,
                        role,
                    },
                    activeTrip: activeTrip ? (0, activeTrip_serialization_1.serializeActiveTrip)(activeTrip, user.prefered_language, role) : null,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    // async addUsers(req: Request, res: Response, next: NextFunction){
    //     try {
    //         const user = await authService.signUp(req.body, req.body.role);
    //         response(res, 201, {status: true, message: "User created successfully!", data: user });
    //     } catch (error) {
    //         next(error);
    //     }
    // }
    async forgetPassword(req, res, next) {
        try {
            await authService_1.default.forgetPassword(req.body.phone);
            // const html = pug.renderFile(`${process.cwd()}/src/templates/forgetPassword.pug`, {code: user.code, username: user.username})
            // sendMail({to: user.email, html, subject: "Reset Password"})
            (0, response_1.default)(res, 200, { status: true, message: 'Reset Code Sent Successfully' });
        }
        catch (error) {
            next(error);
        }
    }
    async verifyResetCode(req, res, next) {
        try {
            await authService_1.default.verifyResetPasswordCode(req.body);
            (0, response_1.default)(res, 200, { status: true, message: 'Code Verified Successfully' });
        }
        catch (error) {
            next(error);
        }
    }
    async resetPassword(req, res, next) {
        try {
            await authService_1.default.resetPassword(req.body);
            (0, response_1.default)(res, 200, { status: true, message: 'Password reset successfully' });
        }
        catch (error) {
            next(error);
        }
    }
    async changePassword(req, res, next) {
        try {
            const userId = req.user;
            await authService_1.default.changePassword(userId, req.body);
            (0, response_1.default)(res, 200, { status: true, message: 'Password changed successfully' });
        }
        catch (error) {
            next(error);
        }
    }
    async sendVerificationCode(req, res, next) {
        try {
            const { user } = req;
            await authService_1.default.sendVerificationCode(user);
            (0, response_1.default)(res, 200, { status: true, message: 'Verification Code Sent Successfully' });
        }
        catch (error) {
            next(error);
        }
    }
    async verifyPhoneCode(req, res, next) {
        try {
            const { user } = req;
            await authService_1.default.verifyPhoneCode(user, req.body.code);
            (0, response_1.default)(res, 200, { status: true, message: 'Phone Verified Successfully' });
        }
        catch (error) {
            next(error);
        }
    }
}
const authController = new AuthController();
exports.default = authController;
