import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
const NAFATH_URL = 'https://nafath.api.elm.sa/stg/api/v1/mfa/request';
const STATUS_URL = 'https://nafath.api.elm.sa/stg/api/v1/mfa/request/status'; // الرابط الجديد

const APP_ID = '75949b4c';
const APP_KEY = '468f22df2308f1852b7626594760f55c';

export const sendNafathRequest = async (nationalId: string) => {
    const requestId = uuidv4();
    const service = "RequestDigitalServicesEnrollment";

    try {
        const response = await axios.post(
            NAFATH_URL,
            {
                nationalId: nationalId,
                service: service,
            },
            {
                params: { local: 'ar', requestId },
                headers: {
                    'Content-Type': 'application/json',
                    'APP-ID': APP_ID,
                    'APP-KEY': APP_KEY,
                },
            }
        );

        const { transId, random } = response.data;

        // حفظ البيانات في قاعدة البيانات
        await prisma.nafathRequest.create({
            data: {
                nationalId,
                service,
                requestId,
                transId,
                random,
                status: 'WAITING',
            },
        });

        return { transId, random, requestId };
    } catch (error) {
        console.error('Error sending request:', error);
        throw new Error('Failed to send request');
    }
};

export const handleCallback = async (transId: string, nationalId: string, random: string) => {
    try {
        // إرسال طلب إلى STATUS_URL
        const response = await axios.post(
            STATUS_URL,
            {
                transId,
                nationalId,
                random,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'APP-ID': APP_ID,
                    'APP-KEY': APP_KEY,
                },
            }
        );

        // استخراج الحالة من الرد
        const { status } = response.data;

        // إرجاع الحالة
        return status;
    } catch (error) {
        console.error('Error in callback:', error);
        throw new Error('Failed to handle callback');
    }
};