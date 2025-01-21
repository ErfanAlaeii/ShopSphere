import { Review } from "../models/review.js";
import { Product } from "../models/products.js";

export const addReview = async (req, res) => {
  const { productId, rating, comment } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const review = new Review({
      user: req.user.id, 
      product: productId,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductReviews = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await Review.find({ product: productId }).populate("user", "name");
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await review.deleteOne();
    res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
