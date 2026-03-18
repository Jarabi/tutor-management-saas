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

// Handle invalid JSON in request bodies
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ message: 'Invalid JSON payload. Check request body formatting.' });
    }
    next(err);
});

export default app;