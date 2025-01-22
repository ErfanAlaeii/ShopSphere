import express from "express";
import {
  initiatePayment,
  confirmPayment,
  getPaymentStatus,
  getUserPayments,
} from "../controllers/paymentController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes (if any payment verification needs to be public)
router.post("/verify", confirmPayment);

// Protected routes (require authentication)
router.use(authenticate);

// Create new payment
router.post("/create", initiatePayment);

// Get payment status by authority
router.get("/status/:authority", getPaymentStatus);

// Get user's payments
router.get("/user/:userId", getUserPayments);

export default router;

