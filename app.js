import express from "express";
import dotenv from "dotenv";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import helmet from "helmet";
import morgan from "morgan";
import logger from "./utils/logger.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/", apiLimiter);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);
app.use(helmet());
app.use(errorHandler);

export default app;
