import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import xss from "xss-clean";
import hpp from "hpp";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { productRoutes } from "./routes/productroutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import logger from "./utils/logger.js";
import { setupSwagger } from "./utils/swagger.js";

dotenv.config();

const app = express();

// 1. Set security headers with Helmet
app.use(helmet());

// 2. Enable CORS with restricted origins and methods
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:5000"],
  methods: "GET,POST,PUT,DELETE,PATCH",
  credentials: true,
}));

// 3. Prevent XSS attacks
app.use(xss());

// 4. Prevent HTTP Parameter Pollution
app.use(hpp());

// 5. Request logger
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// 6. Body parser to handle JSON payloads
app.use(express.json({ limit: "10kb" })); // Limit payload size to 10KB

// 7. Rate limiter for API abuse protection
app.use("/api/", apiLimiter);

// 8. Swagger documentation setup
setupSwagger(app);

// 9. Serve static files if needed
app.use(express.static("public"));

// 10. API routes
app.use("/api/users", userRoutes);
app.use("/api/auth", apiLimiter, authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);

// 11. Catch-all route for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// 12. Error handling middleware
app.use(errorHandler);

export default app;
