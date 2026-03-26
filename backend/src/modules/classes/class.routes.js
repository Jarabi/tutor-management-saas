import express from 'express';
import { authenticate } from '../../middleware/authMiddleware.js';
import {
    createClass,
    deleteClass,
    enrollStudent,
    getClass,
    getClassesWithCount,
    getStudentsInClass,
    removeStudentFromClass,
    updateClass,
} from './class.controller.js';

const router = express.Router();

router.post('/', authenticate, createClass);
router.get('/', authenticate, getClassesWithCount);
router.get('/:id', authenticate, getClass);
router.put('/:id', authenticate, updateClass);
router.delete('/:id', authenticate, deleteClass);

router.post('/:classId/enroll', authenticate, enrollStudent);
router.get('/:classId/students', authenticate, getStudentsInClass);
router.delete(
    '/:classId/students/:studentId',
    authenticate,
    removeStudentFromClass,
);

export default router;
