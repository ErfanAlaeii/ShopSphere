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
import { authenticate } from "./middlewares/authMiddleware.js";

dotenv.config();

const app = express();

// 1. Set security headers with Helmet
app.use(helmet());

// 2. Enable CORS with restricted origins and methods
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : [],
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  })
);

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

// Authentication routes shouldn't require authentication
app.use("/api/auth", authRoutes); 

// 7. Authentication should come first before rate limiting
app.use("/api", authenticate);

// 8. Rate limiter for API abuse protection
app.use("/api/", apiLimiter);

// 9. Swagger documentation setup
setupSwagger(app);

// 10. Serve static files if needed
app.use(express.static("public"));

// 11. API routes

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);

// 12. Catch-all route for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// 13. Error handling middleware
app.use(errorHandler);

export default app;