import { Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
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

const formatUser = (user: InstanceType<typeof User>) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  isGuest: user.isGuest,
});

export const register = async (
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

  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email, isGuest: false });
  if (existingUser) {
    res.status(409).json({
      success: false,
      message: 'An account with this email already exists',
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: name.trim(),
    email,
    password: hashedPassword,
    isGuest: false,
  });

  const token = generateToken(user._id.toString());

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: {
      user: formatUser(user),
      token,
    },
  });
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
    return;
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email, isGuest: false }).select('+password');
  if (!user || !user.password) {
    res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
    return;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
    return;
  }

  const token = generateToken(user._id.toString());

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: formatUser(user),
      token,
    },
  });
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

  const guestName =
    req.body.name?.trim() ||
    `Guest ${Math.floor(Math.random() * 9000) + 1000}`;
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
      user: formatUser(user),
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
      user: formatUser(user),
    },
  });
};
