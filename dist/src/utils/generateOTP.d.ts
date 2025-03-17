declare const encrypt: (code: string) => string;
declare const generateOTP: () => {
    otp: number;
    hashedOTP: string;
    otpExpiration: Date;
};
export default generateOTP;
export { encrypt };
