import express from 'express';
import cors from 'cors';

import authRoutes from './modules/auth/auth.routes.js';
import studentRoutes from './modules/students/student.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Tutor SaaS running');
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/auth', authRoutes);
app.use("/api/students", studentRoutes);

export default app;