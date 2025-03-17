import { Request, Response } from 'express';
import { sendNafathRequest, handleCallback } from '../services/nafathService';

export const sendRequest = async (req: Request, res: Response) => {
    const { nationalId } = req.body;

    try {
        // استدعاء sendNafathRequest لإرسال الطلب
        const { transId, random, requestId } = await sendNafathRequest(nationalId);

        // إرجاع الرد للعميل
        res.status(200).json({
            success: true,
            data: { transId, random, requestId },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to send request' });
    }
};

export const handleCallbackRequest = async (req: Request, res: Response) => {
    const { transId, nationalId, random } = req.body;

    try {
        // استدعاء handleCallback لتحديث الحالة
        const status = await handleCallback(transId, nationalId, random);

        // إرجاع الرد للعميل
        res.status(200).json({
            success: true,
            status,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update status' });
    }
};