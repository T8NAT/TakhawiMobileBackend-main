import { Router } from 'express';
import { checkId } from '../controllers/idController';

const router = Router();

// إضافة Route للتحقق من الهوية
router.post('/check-id', checkId);

export default router;
