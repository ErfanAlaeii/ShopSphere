import Joi from 'joi';
const { optional } = Joi;
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    rating: {
      type: Number,
      optional,
      min: 1,
      max: 5,
    },
    images: {
      type: [String],
      validate: {
        validator: (value) => Array.isArray(value),
        message: "Images must be an array of URLs",
      },
    },
  },
);

productSchema.set("timestamps",true)

export const Product = mongoose.model("Product", productSchema);
