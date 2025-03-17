import { Router } from 'express';
import { sendRequest, handleCallbackRequest } from '../controllers/nafathController';

const router = Router();

router.post('/send-request', sendRequest); // إرسال طلب تحقق
router.post('/request/status', handleCallbackRequest); // تحديث حالة الطلب

export { router as nafathRoutes };