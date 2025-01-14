import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI)
        console.log('MongoDB Connected...');
    }
    catch (err) {
        console.log(err.message)
    }
}

export default connectDB;