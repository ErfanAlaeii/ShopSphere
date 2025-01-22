import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productcontroller.js";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management and retrieval
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of all products in the system.
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Successfully retrieved all products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 64a3d89712e8f51234567abc
 *                   name:
 *                     type: string
 *                     example: Laptop
 *                   price:
 *                     type: number
 *                     example: 1299.99
 *       500:
 *         description: Internal server error
 */

router.get("/", getAllProducts);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieve details of a specific product by its ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product
 *     responses:
 *       200:
 *         description: Successfully retrieved the product.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 64a3d89712e8f51234567abc
 *                 name:
 *                   type: string
 *                   example: Laptop
 *                 price:
 *                   type: number
 *                   example: 1299.99
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

router.get("/:id", getProductById);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new product
 *     description: Only accessible to admins. Allows creating a new product.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Smartphone
 *               price:
 *                 type: number
 *                 example: 899.99
 *               description:
 *                 type: string
 *                 example: A high-end smartphone with 128GB storage.
 *     responses:
 *       201:
 *         description: Successfully created a new product.
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */

router.post("/", authenticate, authorizeRoles("admin"), createProduct);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update a product
 *     description: Only accessible to admins. Allows updating an existing product by its ID.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Laptop
 *               price:
 *                 type: number
 *                 example: 1199.99
 *     responses:
 *       200:
 *         description: Successfully updated the product.
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

router.put("/:id", authenticate, authorizeRoles("admin"), updateProduct);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Only accessible to admins. Allows deleting an existing product by its ID.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product
 *     responses:
 *       200:
 *         description: Successfully deleted the product.
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

router.delete("/:id", authenticate, authorizeRoles("admin"), deleteProduct);

export { router as productRoutes };
