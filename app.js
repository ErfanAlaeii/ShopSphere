import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import logger from "./utils/logger.js";
import { setupSwagger } from './utils/swagger.js';

dotenv.config();

const app = express();

// 1. Security headers
app.use(helmet());

// 2. Logger for incoming requests
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// 3. Body parser to handle JSON payloads
app.use(express.json());

// 4. Rate limiter for API endpoints
app.use("/api/", apiLimiter);

// 5. Swagger documentation setup
setupSwagger(app);

// 6. Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// 7. Error handling middleware (should be the last middleware)
app.use(errorHandler);

export default app;
