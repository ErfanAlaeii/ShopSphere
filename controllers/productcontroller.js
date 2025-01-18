import { Product } from "../models/products.js";
import { createProductSchema, updateProductSchema } from "../validation/productvalidation.js";
import client from "../utils/redisClient.js";
import imageProcessingQueue from "../utils/productQueue.js";

export const createProduct = async (req, res) => {
    const { error } = createProductSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  
    try {
      const product = new Product(req.body);
      await product.save();
  
      
      if (req.body.images) {
        req.body.images.forEach((imageUrl) => {
          imageProcessingQueue.add({ imageUrl });
        });
      }
  
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };


export const getAllProducts = async (req, res) => {
    try {
      const cacheKey = "products:all";
  
      
      const cachedProducts = await client.get(cacheKey);
      if (cachedProducts) {
        return res.status(200).json({ success: true, data: JSON.parse(cachedProducts) });
      }
  
      
      const products = await Product.find();
  
      
      await client.setEx(cacheKey, 3600, JSON.stringify(products));
  
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    const { error } = updateProductSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
