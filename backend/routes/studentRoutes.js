import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
    getStudents,
    createStudent,
    getStudent,
    updateStudent,
    deleteStudent,
} from '../controllers/studentController.js';

const router = express.Router();

router.get("/", authenticate, getStudents);
router.post('/', authenticate, createStudent);
router.get('/:id', authenticate, getStudent);
router.put('/:id', authenticate, updateStudent);
router.delete('/:id', authenticate, deleteStudent);

export default router;