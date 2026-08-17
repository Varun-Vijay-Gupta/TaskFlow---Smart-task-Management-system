import { Response } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { Task, TaskPriority } from '../models/Task';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

const priorityOrder: Record<TaskPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export const getTasks = async (
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

  const {
    status = 'all',
    priority,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    search,
  } = req.query;

  const filter: Record<string, unknown> = { userId: req.userId };

  if (status && status !== 'all') {
    filter.status = status;
  }

  if (priority) {
    filter.priority = priority;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { assignee: { $regex: search, $options: 'i' } },
    ];
  }

  let tasks = await Task.find(filter).sort({ createdAt: -1 });

  if (sortBy === 'priority') {
    tasks = tasks.sort((a, b) => {
      const diff = priorityOrder[b.priority] - priorityOrder[a.priority];
      return sortOrder === 'asc' ? -diff : diff;
    });
  } else if (sortBy === 'dueDate') {
    tasks = tasks.sort((a, b) => {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  } else if (sortBy === 'title') {
    tasks = tasks.sort((a, b) => {
      const cmp = a.title.localeCompare(b.title);
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  } else {
    tasks = tasks.sort((a, b) => {
      const diff =
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sortOrder === 'asc' ? -diff : diff;
    });
  }

  const stats = await Task.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(req.userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const statsMap = {
    total: 0,
    todo: 0,
    in_progress: 0,
    completed: 0,
  };

  stats.forEach((s) => {
    statsMap[s._id as keyof typeof statsMap] = s.count;
    statsMap.total += s.count;
  });

  res.json({
    success: true,
    data: {
      tasks,
      stats: statsMap,
    },
  });
};

export const getTaskById = async (
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

  const task = await Task.findOne({
    _id: req.params.id,
    userId: req.userId,
  });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  res.json({
    success: true,
    data: { task },
  });
};

export const createTask = async (
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

  const { title, description, status, priority, dueDate, assignee } = req.body;

  const task = await Task.create({
    title,
    description,
    status: status || 'todo',
    priority: priority || 'medium',
    dueDate: dueDate ? new Date(dueDate) : undefined,
    assignee,
    userId: req.userId,
  });

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: { task },
  });
};

export const updateTask = async (
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

  const updates = { ...req.body };
  if (updates.dueDate !== undefined) {
    updates.dueDate = updates.dueDate ? new Date(updates.dueDate) : null;
  }

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    updates,
    { new: true, runValidators: true }
  );

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  res.json({
    success: true,
    message: 'Task updated successfully',
    data: { task },
  });
};

export const updateTaskStatus = async (
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

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { status: req.body.status },
    { new: true, runValidators: true }
  );

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  res.json({
    success: true,
    message: 'Task status updated successfully',
    data: { task },
  });
};

export const deleteTask = async (
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

  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId,
  });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  res.json({
    success: true,
    message: 'Task deleted successfully',
  });
};
