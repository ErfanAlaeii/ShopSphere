import express from 'express'
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import dotenv from 'dotenv'
import { productrouter } from './routes/productRoutes.js';

const app = express();
dotenv.config();
connectDB();


app.use('/product', productrouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`)
})