import { Router } from 'express';
import { guestLogin, getProfile } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { guestLoginValidation } from '../validators/task.validator';

const router = Router();

router.post('/guest', guestLoginValidation, guestLogin);
router.get('/profile', authenticate, getProfile);

export default router;
