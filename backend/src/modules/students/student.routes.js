import express from 'express';
import { authenticate } from '../../middleware/authMiddleware.js';
import {
    createStudent,
    getStudents,
    getStudent,
    updateStudent,
    deleteStudent,
} from './student.controller.js';

const router = express.Router();

router.post('/', authenticate, createStudent);
router.get('/', authenticate, getStudents);
router.get('/:id', authenticate, getStudent);
router.put('/:id', authenticate, updateStudent);
router.delete('/:id', authenticate, deleteStudent);

export default router;
