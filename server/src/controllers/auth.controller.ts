import { Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new AppError('Server configuration error', 500);
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};

export const guestLogin = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
    return;
  }

  const guestName = req.body.name?.trim() || `Guest ${Math.floor(Math.random() * 9000) + 1000}`;
  const guestId = uuidv4();

  const user = await User.create({
    name: guestName,
    isGuest: true,
    guestId,
  });

  const token = generateToken(user._id.toString());

  res.status(201).json({
    success: true,
    message: 'Guest login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        isGuest: user.isGuest,
      },
      token,
    },
  });
};

export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const user = await User.findById(req.userId).select('-__v');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isGuest: user.isGuest,
      },
    },
  });
};
