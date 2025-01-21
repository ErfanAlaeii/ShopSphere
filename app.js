import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { productRoutes } from "./routes/productroutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import logger from "./utils/logger.js";
import { setupSwagger } from './utils/swagger.js';

dotenv.config();

const app = express();

// 1. Security headers (important to set early)
app.use(helmet());

// 2. Logger for incoming requests (useful for debugging)
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// 3. Body parser to handle JSON payloads (needed before route handlers)
app.use(express.json());

// 4. Rate limiter for API endpoints (prevents abuse)
app.use("/api/", apiLimiter);

// 5. Swagger documentation setup (improves developer experience)
setupSwagger(app);

// 6. Serve static files (like '/node_modules') if needed
app.use(express.static('public'));

// 7. API routes (define routes after other middleware)
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);

// 8. Error handling middleware (should be the last app.use)
app.use(errorHandler);

export default app;