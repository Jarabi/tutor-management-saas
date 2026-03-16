import express from 'express';
import cors from 'cors';
import '@dotenvx/dotenvx/config';

import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

app.get('/', (req, res) => {
    res.send('Tutor SaaS running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
