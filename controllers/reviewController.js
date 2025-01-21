import Review from "../models/Review.js";
import Product from "../models/Product.js";

export const createReview = async (req, res) => {
  const { productId, rating, comment } = req.body;

  try {
    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ success: false, message: "You have already reviewed this product" });
    }

    const review = new Review({
      user: req.user._id,
      product: productId,
      rating,
      comment,
    });

    await review.save();

    const product = await Product.findById(productId);
    product.reviews.push(review._id);
    await product.save();

    res.status(201).json({ success: true, message: "Review added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductReviews = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await Review.find({ product: productId }).populate("user", "name");
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
