import express from "express";
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from "../controllers/productcontroller.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Admin routes
router.post("/", authorizeRoles('admin'), createProduct);
router.put("/:id", authorizeRoles('admin'), updateProduct);
router.delete("/:id", authorizeRoles('admin'), deleteProduct);

export { router as productRoutes };
