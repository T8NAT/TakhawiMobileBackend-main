import https from 'https';

import {
  SMSResponseOTPType,
  SMSResponseType,
  SMSVerificationData,
} from '../types/smsType';
import { Languages } from '../enum/languages';

class MsegatService {
  private static readonly BASE_URL = 'www.msegat.com';

  private static readonly TIMEOUT = 5000;

  private static request = <T extends SMSResponseType>(
    path: string,
    data: Record<string, string>,
  ): Promise<T> =>
    new Promise((resolve, reject) => {
      const options = {
        hostname: this.BASE_URL,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: this.TIMEOUT,
      };

      const jsonData = JSON.stringify(data);

      const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              const jsonResponse = JSON.parse(responseData);
              resolve(jsonResponse);
            } catch (error) {
              console.error(error);
              reject(
                console.error(`Failed to parse JSON response: ${responseData}`),
              );
            }
          } else {
            reject(
              console.error(
                `Request failed with status ${res.statusCode}: ${responseData}`,
              ),
            );
          }
        });
      });

      req.on('error', (error) => {
        reject(console.error(`Request failed: ${error.message}`));
      });

      req.write(jsonData);
      req.end();
    });

  static sendOTP = async (
    phoneNumber: string,
    lang: string,
  ): Promise<SMSResponseOTPType> => {
    const data = {
      lang: lang === Languages.ARABIC ? 'Ar' : 'En',
      userName: process.env.MSEGAT_USERNAME!,
      apiKey: process.env.MSEGAT_API_KEY!,
      number: phoneNumber,
      userSender: process.env.MSEGAT_SENDER_NAME!,
    };

    return this.request('/gw/sendOTPCode.php', data);
  };

  static verifyOTP = async (
    verificationData: SMSVerificationData,
  ): Promise<SMSResponseType> => {
    const data = {
      lang: verificationData.lang === Languages.ARABIC ? 'Ar' : 'En',
      userName: process.env.MSEGAT_USERNAME!,
      apiKey: process.env.MSEGAT_API_KEY!,
      code: verificationData.code,
      id: verificationData.id,
      userSender: process.env.MSEGAT_SENDER_NAME!,
    };

    return this.request('/gw/verifyOTPCode.php', data);
  };
}

export default MsegatService;
