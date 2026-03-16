import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { getStudents } from "../controllers/studentController.js";

const router = express.Router();

router.get("/", authenticate, getStudents);

export default router;