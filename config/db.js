import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
  let retries = 5;
  while (retries) {
    try {
      await mongoose.connect(mongoURI);
      console.log("MongoDB Connected...");
      break;
    } catch (err) {
      console.log(err.message);
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      await new Promise((res) => setTimeout(res, 5000)); 
    }
  }
};

export default connectDB;
