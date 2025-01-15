import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();


app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);


app.use((err, req, res, next) => {
    res.status(500).json({ success: false, message: err.message });
});

export default app;
