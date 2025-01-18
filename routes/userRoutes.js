import express from "express";
import * as userController from "../controllers/usercontroller.js";
import { authorizeRoles, authenticate } from "../middlewares/authMiddleware.js";

/**
 * @swagger
 * tags:
 *   name: User
 *   description: CRUD operations on users
 */

const router = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *     responses:
 *       201:
 *         description: User created successfully.
 *       400:
 *         description: Validation error or bad request.
 *       401:
 *         description: Unauthorized or insufficient permissions.
 */

router.post("/", authorizeRoles('admin'), userController.createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of results per page.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email.
 *     responses:
 *       200:
 *         description: List of users.
 *       401:
 *         description: Unauthorized or insufficient permissions.
 */

router.get("/", authorizeRoles('admin'), userController.getAllUsers);

/**
 * @swagger
 * /users/{userId}/toggle-active:
 *   patch:
 *     summary: Toggle a user's active status (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to toggle.
 *     responses:
 *       200:
 *         description: User status updated successfully.
 *       401:
 *         description: Unauthorized or insufficient permissions.
 *       404:
 *         description: User not found.
 */

router.patch('/:userId/toggle-active', authenticate, authorizeRoles('admin'), userController.toggleUserActiveStatus);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user details by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user.
 *     responses:
 *       200:
 *         description: User details retrieved successfully.
 *       401:
 *         description: Unauthorized or insufficient permissions.
 *       404:
 *         description: User not found.
 */

router.get("/:id", authorizeRoles('admin'), userController.getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       401:
 *         description: Unauthorized or insufficient permissions.
 *       404:
 *         description: User not found.
 */

router.put("/:id", authorizeRoles('admin'), userController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete.
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       401:
 *         description: Unauthorized or insufficient permissions.
 *       404:
 *         description: User not found.
 */

router.delete("/:id", authorizeRoles('admin'), userController.deleteUser);



export default router;
