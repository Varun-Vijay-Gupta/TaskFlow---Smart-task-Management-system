import { body, param, query } from 'express-validator';

export const guestLoginValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Name must be between 1 and 50 characters'),
];

export const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  body('status')
    .optional()
    .isIn(['todo', 'in_progress', 'completed'])
    .withMessage('Invalid status value'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority value'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO date'),
  body('assignee')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Assignee must not exceed 100 characters'),
];

export const updateTaskValidation = [
  param('id').isMongoId().withMessage('Invalid task ID'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Task title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  body('status')
    .optional()
    .isIn(['todo', 'in_progress', 'completed'])
    .withMessage('Invalid status value'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority value'),
  body('dueDate')
    .optional({ values: 'null' })
    .custom((value) => value === null || !isNaN(Date.parse(value)))
    .withMessage('Due date must be a valid ISO date or null'),
  body('assignee')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Assignee must not exceed 100 characters'),
];

export const updateStatusValidation = [
  param('id').isMongoId().withMessage('Invalid task ID'),
  body('status')
    .isIn(['todo', 'in_progress', 'completed'])
    .withMessage('Invalid status value'),
];

export const taskIdValidation = [
  param('id').isMongoId().withMessage('Invalid task ID'),
];

export const getTasksValidation = [
  query('status')
    .optional()
    .isIn(['todo', 'in_progress', 'completed', 'all'])
    .withMessage('Invalid status filter'),
  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority filter'),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'dueDate', 'priority', 'title'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search query too long'),
];
