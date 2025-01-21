import express from "express";
import { createReview, getProductReviews } from "../controllers/reviewController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createReview); 
router.get("/:productId", getProductReviews); 

export default router;
