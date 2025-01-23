import express from "express";
import {
    createOrder,
    getUserOrders,
    updateOrderStatus,
    getAllOrders,
    deleteOrder,
    completeOrderPayment,
} from "../controllers/orderController.js";

import { validateOrderRequest } from "../middlewares/ordervalidationMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management and retrieval
 */

/**
 * @swagger
 * /orders/create:
 *   post:
 *     summary: Create a new order
 *     description: Allows users to create a new order.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: 64a3d89712e8f51234567abc
 *                     quantity:
 *                       type: number
 *                       example: 2
 *               address:
 *                 type: string
 *                 example: "123 Main Street, City, Country"
 *               paymentMethod:
 *                 type: string
 *                 example: "credit_card"
 *     responses:
 *       201:
 *         description: Order created successfully.
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.post('/create', validateOrderRequest, createOrder);

/**
 * @swagger
 * /orders/{orderId}:
 *   get:
 *     summary: Get user's order by ID
 *     description: Retrieve a specific order for the logged-in user by its ID.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order
 *     responses:
 *       200:
 *         description: Successfully retrieved the order.
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.get("/:orderId", getUserOrders);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     description: Retrieve all orders. Only accessible to admins.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all orders.
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
 *                   userId:
 *                     type: string
 *                     example: 64a3d89712e8f51234567def
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         productId:
 *                           type: string
 *                           example: 64a3d89712e8f51234567ghi
 *                         quantity:
 *                           type: number
 *                           example: 2
 *                   totalPrice:
 *                     type: number
 *                     example: 259.99
 *       403:
 *         description: Forbidden
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.get("/", getAllOrders);

/**
 * @swagger
 * /orders/{orderId}:
 *   delete:
 *     summary: Delete an order
 *     description: Allows deleting an order by its ID. Only accessible to admins.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order
 *     responses:
 *       200:
 *         description: Successfully deleted the order.
 *       404:
 *         description: Order not found
 *       403:
 *         description: Forbidden
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.delete("/:orderId", deleteOrder);

/**
 * @swagger
 * /orders/status:
 *   put:
 *     summary: Update order status
 *     description: Allows updating the status of an order. Only accessible to admins.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: 64a3d89712e8f51234567abc
 *               status:
 *                 type: string
 *                 enum: [pending, completed, cancelled]
 *                 example: completed
 *     responses:
 *       200:
 *         description: Successfully updated the order status.
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */

router.put("/status", updateOrderStatus);

/**
 * @swagger
 * /orders/payment/{orderId}:
 *   put:
 *     summary: Complete order payment
 *     description: Marks an order as paid. Only accessible to admins.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order
 *     responses:
 *       200:
 *         description: Successfully completed the payment for the order.
 *       404:
 *         description: Order not found
 *       403:
 *         description: Forbidden
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.put("/payment/:orderId", completeOrderPayment);


export default router;
