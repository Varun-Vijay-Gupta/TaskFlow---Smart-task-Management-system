import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from '../controllers/task.controller';
import { authenticate } from '../middleware/auth.middleware';
import {
  createTaskValidation,
  updateTaskValidation,
  updateStatusValidation,
  taskIdValidation,
  getTasksValidation,
} from '../validators/task.validator';

const router = Router();

router.use(authenticate);

router.get('/', getTasksValidation, getTasks);
router.get('/:id', taskIdValidation, getTaskById);
router.post('/', createTaskValidation, createTask);
router.put('/:id', updateTaskValidation, updateTask);
router.patch('/:id/status', updateStatusValidation, updateTaskStatus);
router.delete('/:id', taskIdValidation, deleteTask);

export default router;
