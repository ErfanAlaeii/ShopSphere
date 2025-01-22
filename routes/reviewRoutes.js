import express from "express";
import { addReview, getProductReviews, deleteReview } from "../controllers/reviewController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, addReview);
router.get("/:productId", getProductReviews);
router.delete("/:reviewId", authenticate, deleteReview);

export default router;
