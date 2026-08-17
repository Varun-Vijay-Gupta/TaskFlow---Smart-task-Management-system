import { Router } from 'express';
import {
  register,
  login,
  guestLogin,
  getProfile,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import {
  guestLoginValidation,
  registerValidation,
  loginValidation,
} from '../validators/auth.validator';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/guest', guestLoginValidation, guestLogin);
router.get('/profile', authenticate, getProfile);

export default router;
