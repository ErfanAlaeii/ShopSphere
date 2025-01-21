import express from "express";
import { addReview, getProductReviews, deleteReview } from "../controllers/reviewController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, addReview);
router.get("/:productId", getProductReviews);
router.delete("/:reviewId", authMiddleware, deleteReview);

export default router;
