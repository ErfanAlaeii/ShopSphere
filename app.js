import express from 'express';
import dotenv from 'dotenv';
import { apiLimiter } from './middlewares/rateLimiter.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middlewares/errorMiddleware.js';

dotenv.config();

const app = express();


app.use(express.json());

app.use('/api/', apiLimiter);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use(errorHandler);



export default app;
