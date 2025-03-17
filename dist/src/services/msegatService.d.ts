import { SMSResponseOTPType, SMSResponseType, SMSVerificationData } from '../types/smsType';
declare class MsegatService {
    private static readonly BASE_URL;
    private static readonly TIMEOUT;
    private static request;
    static sendOTP: (phoneNumber: string, lang: string) => Promise<SMSResponseOTPType>;
    static verifyOTP: (verificationData: SMSVerificationData) => Promise<SMSResponseType>;
}
export default MsegatService;
